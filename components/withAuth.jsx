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
                pathname: 'usuario/',
                tokenRequired: true,
            },
            {
                pathname: '/ventas',
                tokenRequired: true,
            },
        ]


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

        const userHastoken = async () =>{
            const token = cookie.get('accessToken');
            const isTokenAvailable = token ? true : false;
            if(!isTokenAvailable){
                const success =  auth.refreshToken();
                return success;
            }
            return isTokenAvailable;
        }

        const getAuthToPath = async ()  => {
            const data = await auth.getRoute(router.asPath);
            return data;
        }


        const newEvaluate = async (cb) => {
            const attemptException = exceptions.find(paths => paths.pathname == router.asPath);
            if(attemptException){
                if(attemptException.tokenRequired && ! await userHastoken()) cb('/', 'push');
            }else{
                if(await userHastoken()){
                    const userAccess = await getAuthToPath();
                    if(!userAccess.access)  return cb('/unauthorized', 'replace')
                }else{
                    cb('/', 'push')
                }   
            }
        }


        /*const exceptionPages = ['/', '/dashboard', '/usuario/perfil', '/ventas']

        const hasUserAccess = async () => {
            const isException = exceptionPages.find(page => page == router.asPath);
            const token = cookie.get('accessToken');

            
            if(isException){

                if(token){
                    const decode = jose.decodeJwt(token);
                    const isExpired = dayjs.unix(decode.exp).diff(dayjs()) < 1;

                    if(isExpired){
                        if(!auth.refreshToken()){
                            cookie.remove('accessToken');
                            window.location.href = '/';
                        }
                    }

                    if(router.asPath == '/'){
                        router.push('/dashboard')
                    }
                }else{
                    router.push('/')
                }
               
            }else{
                if(router.asPath !== '/'){
                    const data = await auth.getRoute(router.asPath);
                    if(data?.access === false || !data) router.replace('/unauthorized')
                }

            }
           
        }*/


        useEffect(() => {
            newEvaluate(RedirecTo)
            //hasUserAccess();
        },[]);

        return <Component /> 
    }
    return AuthorizationComponent;
}



export default witAuth;
