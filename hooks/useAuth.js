import jsCookie from 'js-cookie';
import { post_login, post_logouth} from '../services/AuthServices';

function useAuth(){

    const login = async (body) => {
        const token = await post_login(body)
        if(!token) return false;
        jsCookie.set('accessToken', token);
        return true;
    }

    const logOut = async () => {
        const data = await post_logouth();
        if(data) return false;
        jsCookie.remove('accessToken');
       return true;
    }

    return {
        logOut,
        login
    }
}

export default useAuth;