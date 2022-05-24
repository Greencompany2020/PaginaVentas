import { useState, useEffect } from "react";
import jsCookie from "js-cookie";
import {get_plazasGrupo, get_tiendasGrupo, get_user} from '../services/UserServices';

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

    const checkToken = () => {
        const token = jsCookie.get('accessToken')
        if(!token) return false;
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
        getTiendas
    }
}

export default useProvideUser;