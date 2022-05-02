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
