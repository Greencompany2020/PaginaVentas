import ApiProvider from "./ApiProvider";


export const get_plazasGrupo = async () =>{
    try{
        const {data, status} = await ApiProvider.get('/tiendasplazas/plazas');
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false;
    }
}


export const get_tiendasGrupo = async () =>{
    try{
        const {data, status} = await ApiProvider.get('/tiendasplazas/tiendas');
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false
    }
}


export const post_resetPassword = async (body) => {
    try{
        const {data, status} = await ApiProvider.post('/user/reset-password', body);
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false;
    }
}

export const post_newPassword = async (body, resetToken) => {
    try{
        const {data, status} = await ApiProvider.post('/user/new-password', body, {headers:{'Reset': resetToken}});
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false;
    }
}

export const get_user = async () => {
    try{
        const {data, status} = await ApiProvider.get('/user/perfil');
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false;
    }
}