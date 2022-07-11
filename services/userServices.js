import ApiProvider from "./ApiProvider";

export default function userService(){

    const getUser = async () => {
        try {
            const { data } = await ApiProvider.get('/user/perfil');
            return data.user;
        } catch (error) {
          throw error
        }
    }

    const getUserAccess = async () => {
        try {
            const { data } = await ApiProvider.get('/user/perfil');
            return data.dashboards;
        } catch (error) {
            throw error
        }
    }

    const getPlazas = async () => {
        try {
            const {data} = await ApiProvider.get('/tiendasplazas/plazas');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getTiendas = async () => {
        try {
            const { data } = await ApiProvider.get('/tiendasplazas/tiendas');
            return data;
        } catch (error) {
            throw error;
        }
    }

    const getDirectAccess = async (idUser) => {
        try {
            const { data } = await ApiProvider.get(`/user/dashboards/${idUser}`);
            return data; 
        } catch (error) {
            throw error;
        }
    }

    const setDirectAccess = async (idAccess, body) => {
        try {
            const response = await ApiProvider.put(`user/dashboards/selected/${idAccess}`, {enabled:body});
            return response;
        } catch (error) {
            throw error
        }
    }

    const requestPasswordReset = async (body) => {
        try {
            const response = await ApiProvider.post('/user/reset-password', body);
            return response;
        } catch (error) {
            throw error
        }
    }

    const resetPassword = async (body, resetToken) => {
       try {
        const response = await ApiProvider.post('/user/new-password', body, { headers: { 'Reset': resetToken } });
            return response;
       } catch (error) {
            throw error;
       }
    }

    const setUserAvatar = async(body, progressHandle) => {
        try {
            const response = await ApiProvider.post('user/perfil/image', body , {
              onUploadProgress: progressHandle
            });
            return response;
        } catch (error) {
           throw error;
        }
    }

    const getAccessParameters = async(idAccess) =>{
        try {
            const {data} = await ApiProvider.get(`user/dashboards/parameters/${idAccess}`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const setAccessParameter = async(idAccess,body) =>{
        try {
            const response = await ApiProvider.post(`user/dashboards/parameters/${idAccess}`, body);
            return response;
        } catch (error) {
            throw error;
        }
    }

    const getGlobalParameters = async() =>{
        try {
            const {data} = await ApiProvider.get(`user/dashboards/parameters/globals/1`);
            return data;
        } catch (error) {
            throw error;
        }
    }

    const setGlobalParameters = async(idAccess) => {
        try {
            const body = {
                idProyect:1,
                favoriteAccess: idAccess,
            }
            const response = await ApiProvider.post(`user/dashboards/parameters/globals/${idAccess}`,body);
            return response;
        } catch (error) {
            throw error;
        }
    }
    return{
        getUser,
        getPlazas,
        getTiendas,
        getDirectAccess,
        setDirectAccess,
        requestPasswordReset,
        resetPassword,
        setUserAvatar,
        getUserAccess,
        setAccessParameter,
        getAccessParameters,
        getGlobalParameters,
        setGlobalParameters,
    }

}
