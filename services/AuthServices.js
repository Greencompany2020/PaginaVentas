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
        const {data, status} = await ApiProvider.post('/user/dashboards/acceso', body);
        if(status !== 200) return false;
        return data;
    }catch(err){
        const {status} = err;
        return false;
    }
}
