import jsCookie from 'js-cookie';
import {loginAuth, getRouteAuth, refreshTokenAuth, logOutAuth} from '../services/AuthServices';
import {useRouter} from 'next/router';

function useProvideAuth(){
    const router = useRouter();
    
    
    const signIn = async (body) => {
        try{
            const token = await loginAuth(body);
            if(token){
                jsCookie.set('accessToken', token,{expires: 1});
                window.location.href = '/dashboard'
            }
            return false;
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
                jsCookie.set('accessToken', token,{expires: 1});
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