import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import Unauthorized from "../pages/unauthorized";

/**
 * Este hoc envuelte toda los componentes para validar rutas
 * 
 */


export default WrappedComponent  =>{

    /**
     * Obtiene los valores iniciales desde el initialProps
     * Obtiene el componente que renderizara
     * utiliza el contexto de useAuth y router
     * @param {*} props 
     * @returns 
     */
    const hoc = ({...props}) => {
        const auth = useAuth();
        const router = useRouter();

        const matchPath = () => {
            const foundPath = auth.routes.find(route => route.pathname == props.serverProps.pathname);
            return foundPath ? true : false;
        }

        const redirect = matchPath();

        useEffect(()=>{
            console.log('estoy aqui');
            if(!redirect){
                router.push('/unauthorized');
            }
        },[])
        return redirect ? <WrappedComponent {...props}/> : null

    }

    /**
     * Revisa desde el servidor de node el contexto (req, res)
     * Obtiene el pathname de la pagina
     * Regresa la cookie
     * @param {*} context 
     * @returns 
     */
    hoc.getInitialProps = async (context) => {
        const {pathname} = context;
        const serverProps = {
            pathname
        }
        return { serverProps };
    }

    return hoc;
}