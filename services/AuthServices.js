import ApiProvider from "./ApiProvider";

/**
 * Recibe el nombre de usuario y contraseña.
 * @param {UserCode:string, password:string} body 
 * @returns Token
 */

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

/**
 * Deslogea al usuario
 */
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

export async function refreshTokenAuth(){
    try{
        const data =  await ApiProvider.get('/auth/refresh');
        const token = data.accessToken;
        return token
    }catch(err){
        return false;
    }
}