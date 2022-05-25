import jsCookie from 'js-cookie';
import { post_login, get_logouth} from '../services/AuthServices';

function useAuth(){

    const login = async (body) => {
        const token = await post_login(body)
        if(!token) return false;
        jsCookie.set('accessToken', token);
        return true;
    }

    const logOut = async () => {
        await get_logouth();
        jsCookie.remove('accessToken');
        jsCookie.remove('jwt');
        console.log('salido');
        window.location.href = '/'
        return true;
    }

    return {
        logOut,
        login
    }
}

export default useAuth;