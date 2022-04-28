import { useState, useEffect } from "react";
import {get_plazasGrupo, get_tiendasGrupo} from '../services/UserServices';

function useProvideUser(){

    const [plazas, setPlazas] = useState();
    const [tiendas, setTiendas] = useState();

    const getPlazas = async () => {
        const data = await get_plazasGrupo();
        if(!data) return false;
        setPlazas(data);
    }

    const getTiendas = async () => {
        const data = await get_tiendasGrupo();
        if(!data) return false;
        setTiendas(data);
  
    }

    useEffect(()=> {
        getPlazas();
        getTiendas();
    },[]);

    return {
        plazas,
        tiendas,
    }
}

export default useProvideUser;