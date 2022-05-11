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
        const data = await get_logouth();
        if(!data) return false;
        jsCookie.remove('accessToken');
        jsCookie.remove('jwt');
        return true;
    }

    return {
        logOut,
        login
    }
}

export default useAuth;