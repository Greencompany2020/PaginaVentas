import jsCookie from 'js-cookie';
import {loginAuth} from '../services/AuthServices';
import {useRouter} from 'next/router';
import {useState} from 'react'


function useProvideAuth(){

    const [routes, setRoutes] = useState([
        {
            id: 1,
            pathname: '/dashboard'
        },
        {
            id: 2,
            pathname: '/plazas'
        },

        {
            id: 2,
            pathname: '/comparativo/grupo'
        },
        {
            id: 2,
            pathname: '/comparativo/plazas'
        }
    ]);


    const router = useRouter();    
    const signIn = async (body) => {
        try{
            const token = await loginAuth(body);
            if(token){
                jsCookie.set('accessToken', token);
                router.push('/dashboard')
            }
        }catch(err){
            console.log(err);
        }
    }

    const logOut = async () => {
        try{
            await logOutAuth();
            jsCookie.remove('accessToken');
            router.push('/');
        }catch(err){
            console.log(err);
        }
    }

  
    return {
        signIn,
        logOut,
        routes
    }
}

export default useProvideAuth;