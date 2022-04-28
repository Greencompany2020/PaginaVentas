import ApiProvider from "./ApiProvider";

export const post_login = async (body) => {
    try{
        const {data:accessToken, status} = await ApiProvider.post('/auth/login', body);
        if(status !== 200) return false;
        return accessToken.accessToken;
    }catch (err){
        const {status} = err;
        return false;
    }
}


export const post_logouth = async () => {
    try{
        const {status} = await ApiProvider.post('/auth/logout');
        if(status !== 200) return false;
        return true;
    }catch(err){
        const {status} = err;
        return false;
    }
}

export const post_accessTo = async (point) => {
    const body = {point};
    try{
        const {data, status} = await ApiProvider.post('/user/dashboard/acceso', body);
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false;
    }
}


export const get_user = async () => {
    try{
        const {data, status} =  await ApiProvider.get('/user/perfil');
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false;
    }
}


export const get_refreshToken = async () => {
    try{
        const {data:accessToken, status} =  await ApiProvider.get('/auth/refresh');
        if(status !== 200) return false;
        return accessToken;
    }catch(err){
        const {status} = err;
        return false;
    }
}


export async function loginAuth(body) {

    try{
        const {data} = await ApiProvider.post('/auth/login', body);
        const token = data.accessToken;
        return token;
    }
    catch(err){
        return false;
    }
}


export async function logOutAuth(){

    try{
        const data = await ApiProvider.get('/auth/logout');
        return data;
    }catch(err){
        return false;
    }
}

export async function getRouteAuth(body){
    try{
        const data = await ApiProvider.post('/user/dashboards/acceso', {point:body})
        return data;
    }catch(err){
        return false;
    }
}

export async function getUserPerfil(){
    try{
        const {data} = await ApiProvider.get('/user/perfil')
        return data;
    }catch(err){
        return false;
    }
    

}

export async function refreshTokenAuth(){
    try{
        const data =  await ApiProvider.get('/auth/refresh');
        const token = data.accessToken;
        return token
    }catch(err){
        return false;
    }
}