import reporteProvider from "./providers/reporteProvider";
import configuradorProvider from "./providers/configuradorProvider";

export default function authService(){
    const login = async (body) => {
        try {
            const {data} = await configuradorProvider.post('/auth/login', body);
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    const logout = async () => {
        try {
            const {data} = await configuradorProvider.get('/auth/logout');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getUserAuthorization = async (point) => {
        const body = {point};
        try{
            const {data} = await configuradorProvider.post('/user/dashboards/acceso', body);
            return data;
        }catch(err){
           throw err;
        }
    }

    const getUserData = async () => {

        return Promise.all([
            configuradorProvider.get('/user/perfil'),
            reporteProvider.get('/tiendasplazas/plazas'),
            reporteProvider.get('/tiendasplazas/tiendas'),
            configuradorProvider.get(`user/dashboards/parameters/globals/1`),
        ])
        .then(response => (response.map(res => res.data)))
        .catch(error => {throw error});

    }


    return{
        login,
        logout,
        getUserAuthorization,
        getUserData,
    }
}