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
        const {data, status} = await ApiProvider.get(`configurador/accesos/perfil/${id}`);
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }
}

const post_assignAccesToUser = async(body) => {
    try {
        const {data, status} = await ApiProvider.post('configurador/accesos/assign', body);
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }
}

const put_updateUserAccess = async (id, body) => {
    try{
        const params = { enabled: body}
        const {data, status} = await ApiProvider.put(`configurador/accesos/enabled/${id}`, params);
        if(status !== 200) return false;
        return data;
    }catch(error){
        return false;
    }
}

const post_createUser = async (body) => {
    try{
        const {data, status} = await ApiProvider.post('configurador/usuarios/create', body);
        if(status !== 201) return false;
        return data;
    }catch(err){
        return false;
    }
}

const put_updateUser = async (id,body) => {
    try{
        const {data, status} = await ApiProvider.put(`configurador/usuarios/update/${id}`, body);
        if(status !== 200) return false;
        return data;
    }catch(err){
        return false;
    }
}

const del_deleteUser = async (id) => {
    try {
        const {data, status} = await ApiProvider.delete(`configurador/usuarios/delete/${id}`);
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }
}

const post_createGroup = async (body) => {
    try{
        const {data, status} = await ApiProvider.post('configurador/grupos/create', body);
        if(status !== 200) return false;
        return data;
    }catch(err){
        return false
    }
}

const put_updateGroup = async (id, body) => {
    try{
        const params = {Nombre: body}
        const {data, status} = await ApiProvider.put(`configurador/grupos/update/${id}`, params);
        if(status !== 200) return false;
        return data;
    }catch(err){
        return false;
    }
}

const del_deleteGroup = async (id) => {
    try {
        const {data, status} = await ApiProvider.delete(`configurador/grupos/delete/${id}`);
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;       
    }
}

const post_createAccess = async(body) => {
    try {
        const {data, status} = await ApiProvider.post('configurador/accesos/create', body)
        if(status !== 200) return false;
        return data;
    } catch (error) {
        return false;
    }
}


const put_updateAccess = async(id,body) => {
    try{
        const {data, status} = await ApiProvider.put(`configurador/accesos/update/${id}` ,body);
        if(status !== 200) return false;
        return data;
    }catch(err){
        return false;
    }
}

const del_deleteAccess = async(id) => {
    try{
        const {data, status} = await ApiProvider.delete(`configurador/accesos/delete/${id}`);
        if(status !== 200) return false;
        return data;
    }catch(err){
        return false;
    }
}

export {
    get_groups,
    get_access,
    get_users,
    get_userAccess,
    put_updateUserAccess,
    post_createUser,
    post_createGroup,
    put_updateGroup,
    put_updateUser,
    del_deleteGroup,
    del_deleteUser,
    post_assignAccesToUser,
    post_createAccess,
    put_updateAccess,
    del_deleteAccess
}