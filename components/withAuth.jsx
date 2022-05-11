import { post_accessTo } from "../services/AuthServices";
import { useRouter} from "next/router";
import cookie from "js-cookie";

const witAuth = (Component) => {

    const AuthorizationComponent = () => {
        const router = useRouter();

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
        const redirecTo = (page, opt = 'push') => {
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
        const userHastoken = () =>{
            const token = cookie.get('accessToken');
            const isTokenAvailable = token ? true : false;
            return isTokenAvailable;
        }


        /**
         * Evalua si el usuario tiene permisos para ingresar al point
         * @returns data
         */
        const getAuthToPath = async ()  => {
            const data = await post_accessTo(router.asPath);
            return data;
        }


        const attemptException = exceptions.find(paths => paths.pathname == router.asPath);
        const userToken = userHastoken();
        /**
         * evalua el pint al que se quiere ingresar
         * recibe una callbacl que ejecuta el redirect o el push
         * si el usuario no esta autorizado remplaza la direccion
         * si el usuario no tiene token lo redirecciona al login
         * si el usuario tiene token y quiere ingresar al login lo redirige al dashboard
         * @param {*} cb 
         * @returns 
         */
        const pathEvaluate = async () => {
            if(attemptException){
                if(attemptException.tokenRequired && !userToken) redirecTo('/', 'push');
                if(attemptException.pathname == '/' && userToken) redirecTo('/dashboard', 'push');
            }else{
                if(!userToken) cb('/', 'push');
                const userAccess = await getAuthToPath();
                if(!userAccess.access)  return redirecTo('/unauthorized', 'replace');
            }
            return false;
        }

        pathEvaluate();

        return <Component/>
    }
    return AuthorizationComponent;
}

export default witAuth;
