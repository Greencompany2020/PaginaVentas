import ApiProvider from "./ApiProvider";

const get_users =  async () =>{
    try {
        const {data, status} = await ApiProvider.get('/configurador/usuarios');
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }
}

const get_groups = async () => {
    try {
        const {data, status} = await ApiProvider.get('/configurador/grupos');
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }
}

const get_access = async () => {
    try {
        const {data, status} = await ApiProvider.get('/configurador/accesos');
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }

}


const get_userAccess = async (id) => {
    try {
        const {data, status} = await ApiProvider.get(`/configurador/accesos/perfil/${id}`);
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }
}

const put_updateUserAccess = async (id, body) => {
    try{
        const params = { enabled: 'N'}
        const {data, status} = await ApiProvider.put(`/configurador/accesos/enabled/${id}`, params);
        if(status !== 200) return false;
        return data;
    }catch(error){
        return false;
    }
}

const post_createUser = async (body) => {
    try{
        const {data, status} = await ApiProvider.post('configurador/usuarios/create', body);
        if(status !== 200) return false;
        return data;
    }catch(err){
        return err;
    }
}
export {
    get_groups,
    get_access,
    get_users,
    get_userAccess,
    put_updateUserAccess,
    post_createUser,
}