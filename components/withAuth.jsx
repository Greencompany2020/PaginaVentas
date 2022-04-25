import { useRouter} from "next/router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import cookie from "js-cookie";
import * as jose from 'jose';
import dayjs from "dayjs";

const witAuth = (Component) => {
    const AuthorizationComponent = () => {

        const router = useRouter();
        const auth = useAuth();
        const exceptionPages = ['/', '/dashboard', '/usuario/perfil']


        const hasUserAccess = async () => {
            const isException = exceptionPages.find(page => page == router.asPath);

            if(isException){

                const token = cookie.get('accessToken');
                if(token){
                    const decode = jose.decodeJwt(token);
                    const isExpired = dayjs.unix(decode.exp).diff(dayjs()) < 1;

                    if(isExpired){
                        if(!auth.refreshToken()){
                            cookie.remove('accessToken');
                            router.push('/');
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

        }

        useEffect(() => {
            hasUserAccess();
        },[]);

        return  <Component />
    }
    return AuthorizationComponent;
}



export default witAuth;
