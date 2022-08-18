import { configuradorProvider } from "./apiProvider";

export default function userService(){

    const getUser = async () => {
        try {
            const { data:user } = await configuradorProvider.get('/user/perfil');
            return user;
        } catch (error) {
          throw error
        }
    }

    const getUserAccess = async () => {
        try {
            const { data } = await configuradorProvider.get('/user/perfil');
            return data.dashboards;
        } catch (error) {
            throw error
        }
    }

    const getPlazas = async () => {
        try {
            const {data} = await configuradorProvider.get('/tiendasplazas/plazas');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getTiendas = async () => {
        try {
            const { data } = await configuradorProvider.get('/tiendasplazas/tiendas');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getDirectAccess = async (idUser) => {
        try {
            const { data } = await configuradorProvider.get(`/user/dashboards/${idUser}`);
            return data; 
        } catch (error) {
            throw error;
        }
    }

    const setFavoriteAccess = async (idAccess, body) => {
        try {
            await configuradorProvider.put(`user/dashboards/selected/${idAccess}`, {enabled:body});
            const {data} = await  configuradorProvider.get('/user/perfil');
            return data.dashboards;
        } catch (error) {
            throw error
        }
    }

    const requestPasswordReset = async (body) => {
        try {
            const response = await configuradorProvider.post('/user/reset-password', body);
            return response;
        } catch (error) {
            throw error
        }
    }

    const resetPassword = async (body, resetToken) => {
       try {
        const response = await configuradorProvider.post('/user/new-password', body, { headers: { 'Reset': resetToken } });
            return response;
       } catch (error) {
            throw error;
       }
    }



    const updateUserAvatar = async(body, progressHandle) => {

        const config ={
            onUploadProgress: progressHandle
        }

        try {
            await configuradorProvider.post('user/perfil/image', body, config)
            const {data} = await  configuradorProvider.get('/user/perfil');
            return data.user;
        } catch (error) {
            throw error;            
        }

    }


    const getAccessParameters = async(idAccess) =>{
        try {
            const {data} = await configuradorProvider.get(`user/dashboards/parameters/${idAccess}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const setAccessParameter = async(idAccess,body) =>{
        try {
            const response = await configuradorProvider.post(`user/dashboards/parameters/${idAccess}`, body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const getGlobalParameters = async() =>{
        try {
            const {data} = await configuradorProvider.get(`user/dashboards/parameters/globals/1`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const updateGlobalParameters = async(idAccess) => {
        try {
            const body = {
                idProyect:1,
                favoriteAccess: idAccess,
            }
            await configuradorProvider.post(`user/dashboards/parameters/globals/${idAccess}`,body);
            const {data} = await configuradorProvider.get(`user/dashboards/parameters/globals/1`);
            return data;
        } catch (error) {
            throw error;
        }
    }
    return{
        getUser,
        getPlazas,
        getTiendas,
        getDirectAccess,
        setFavoriteAccess,
        requestPasswordReset,
        resetPassword,
        updateUserAvatar,
        getUserAccess,
        setAccessParameter,
        getAccessParameters,
        getGlobalParameters,
        updateGlobalParameters,
    }

}
