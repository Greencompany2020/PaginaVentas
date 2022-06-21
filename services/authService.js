import ApiProvider from "./ApiProvider";

export default function authService(){
    const login = async (body) => {
        try {
            const {data} = await ApiProvider.post('/auth/login', body);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const logout = async () => {
        try {
            const {data} = await ApiProvider.get('/auth/logout');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getUserAuthorization = async (point) => {
        const body = {point};
        try{
            const {data} = await ApiProvider.post('/user/dashboards/acceso', body);
            return data;
        }catch(err){
           throw err;
        }
    }

    return{
        login,
        logout,
        getUserAuthorization,
    }
}