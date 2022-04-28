import { useRouter} from "next/router";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState} from "react";
import cookie from "js-cookie";
import * as jose from 'jose';
import dayjs from "dayjs";



const witAuth = (Component) => {

    const AuthorizationComponent = () => {
        const router = useRouter();
        const auth = useAuth();
        const [isEva, setEva] = useState(true);

        /**
         * paginas con reglas expeciales
         */
        const exceptions = [
            {
                pathname: '/',
                tokenRequired: false,
            },
            {
                pathname: '/dashboard',
                tokenRequired: true,
            },
            {
                pathname: '/usuario/perfil',
                tokenRequired: true,
            },
            {
                pathname: '/ventas',
                tokenRequired: true,
            },
        ]


        /**
         * callback que redirige la pagina
         * @param {*} page 
         * @param {*} opt 
         */
        const RedirecTo = (page, opt = 'push') => {
            switch (opt){
                case 'replace':
                    router.replace(page);
                    break;
                case 'push':
                    router.push(page);
                    break;
                default :
                    router.push(page);
                    break;
            }
        }


        /**
         * Evalua si el usuario tiene tiene un token de acceso
         * Si lo tiene y esa expirado tratara de refrescarlo
         * @returns boolean
         */
        const userHastoken = async () =>{
            const token = cookie.get('accessToken');
            const isTokenAvailable = token ? true : false;
            if(!isTokenAvailable){ 
                return false;
            }
            const decodeToken = jose.decodeJwt(token);
            const isExpired = (dayjs.unix(decodeToken.exp).diff(dayjs()) < 1);
            if(!isExpired){
                return true
            };
            const isTokenRefresh = await auth.refreshToken();
            return isTokenRefresh
        }


        /**
         * Evalua si el usuario tiene permisos para ingresar al point
         * @returns data
         */
        const getAuthToPath = async ()  => {
            const data = await auth.getRoute(router.asPath);
            return data;
        }


        /**
         * evalua el pint al que se quiere ingresar
         * recibe una callbacl que ejecuta el redirect o el push
         * si el usuario no esta autorizado remplaza la direccion
         * si el usuario no tiene token lo redirecciona al login
         * si el usuario tiene token y quiere ingresar al login lo redirige al dashboard
         * @param {*} cb 
         * @returns 
         */
        const pathEvaluate = async (cb) => {
            const attemptException = exceptions.find(paths => paths.pathname == router.asPath);
            const userToken = await userHastoken();

            if(attemptException){
                if(attemptException.tokenRequired && !userToken) cb('/', 'push');
                if(attemptException.pathname == '/' && userToken) cb('/dashboard', 'push');
            }else{
                if(!userToken) cb('/', 'push');
                const userAccess = await getAuthToPath();
                if(!userAccess.access)  return cb('/unauthorized', 'replace');
            }
            
        }

        pathEvaluate(RedirecTo);

        /*useEffect(() => {
            pathEvaluate(RedirecTo);
            setEva(false);
        },[eval]);*/

        return <Component/> 
    }
    return AuthorizationComponent;
}



export default witAuth;
