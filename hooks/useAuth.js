import {useState} from 'react';
import jsCookie from 'js-cookie';
import {loginAuth, getRouteAuth, refreshTokenAuth, logOutAuth, getUserPerfil, post_login, get_user} from '../services/AuthServices';
import {useRouter} from 'next/router';

function useProvideAuth(){
    const [common, setCommon] = useState(null);
    const router = useRouter();
    
    const login = async (body) => {
        const token = await post_login(body)
        if(!token){
            alert('Usuario o contraseña invalidos');
            return false;
        }
        jsCookie.set('accessToken', token, {expires: 1});
        router.push('/dashboard');
    }


    const getUserData = async () =>{
        const data = await get_user();
        if(!data) return false;
        return data;
    }


    const signIn = async (body) => {
        try{
            const token = await loginAuth(body);
            if(token){
                jsCookie.set('accessToken', token,{expires: 1});
                await userPerfil();
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
        const token = await refreshTokenAuth();
        if(!token){
            return false;
        }
        jsCookie.set('accessToken', token,{expires: 1});
        return true;
    }

    const userPerfil = async () => {
        try{
            const data = await getUserPerfil();
            console.log(data); 
            if(data){
                setUserData(data);
            }
        }catch(err){
            console.log(err);
        }
    }

    return {
        signIn,
        logOut,
        getRoute,
        refreshToken,
        login,
        getUserData,
        common
    }
}

export default useProvideAuth;