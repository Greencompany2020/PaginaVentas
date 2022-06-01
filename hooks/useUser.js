import { useState, useEffect } from "react";
import {get_plazasGrupo, get_tiendasGrupo, get_user, post_resetPassword} from '../services/UserServices';

function useProvideUser(){

    const [plazas, setPlazas] = useState();
    const [tiendas, setTiendas] = useState();
    const [user, setUser] = useState();
    const [dashboard, setDashboard] = useState();

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

    const getUserData = async () => {
        const data = await get_user();
        if(!data) return false;
        const {user} = data;
        const {dashboards} = data;
        setUser(user);
        setDashboard(dashboards)
    }

    const changePassword = async (body) => {
        const response = await post_resetPassword(body);
        if(!response) return false;
        return true;
    }

    useEffect(()=>{
        getTiendas();
        getPlazas();
        getUserData();
    },[]);

    return {
        plazas,
        tiendas,
        user,
        dashboard,
        getUserData,
        getPlazas,
        getTiendas,
        changePassword

    }
}

export default useProvideUser;