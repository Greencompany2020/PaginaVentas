import jsCookie from 'js-cookie';
import {loginAuth, getRouteAuth, refreshTokenAuth, logOutAuth} from '../services/AuthServices';
import {useRouter} from 'next/router';

function useProvideAuth(){
    const router = useRouter();
    
    
    const signIn = async (body) => {
        try{
            const token = await loginAuth(body);
            console.log(token);
            if(token){
                jsCookie.set('accessToken', token);
                window.location.href = '/dashboard';
            }
        }catch(err){
            return false;
        }
    }

    const logOut = async () => {
        try{
            await logOutAuth();
            jsCookie.remove('accessToken');
            router.push('/');
        }catch(err){
           return false;
        }
    }

    const getRoute = async (body) =>{
        try{
            const {data} = await getRouteAuth(body);
            return data;
        }catch(err){
           return {access:false}
        }
    }

    const refreshToken = async() => {
        try{
            const token = await refreshTokenAuth();
            if(token){
                jsCookie.set('accessToken', token);
                return true;
            }
            return false
        }catch(err){
            return false
        }
    }

    return {
        signIn,
        logOut,
        getRoute,
        refreshToken,
    }
}

export default useProvideAuth;