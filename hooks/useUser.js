import { useState, useEffect } from "react";
import { get_plazasGrupo, get_tiendasGrupo, get_user, post_resetPassword, get_userDashboards, put_setEnabled, post_perfilImage } from '../services/UserServices';

function useProvideUser() {

    const [plazas, setPlazas] = useState();
    const [tiendas, setTiendas] = useState();
    const [user, setUser] = useState();
    const [dashboard, setDashboard] = useState();

    const getPlazas = async () => {
        const data = await get_plazasGrupo();
        if (!data) return false;
        setPlazas(data);
    }

    const getTiendas = async () => {
        const data = await get_tiendasGrupo();
        if (!data) return false;
        setTiendas(data);
    }

    const getUserData = async () => {
        const data = await get_user();
        if (!data) return false;
        const { user } = data;
        const { dashboards } = data;
        setUser(user);
        setDashboard(dashboards)
    }

    const changePassword = async (body) => {
        const response = await post_resetPassword(body);
        if (!response) return false;
        return true;
    }

    const getEnabledDashboards = async (idUser) => {
        const response = await get_userDashboards(idUser);
        if (!response) return false;
        return response;
    }

    const setEnabledDashboard = async (idUser, idDashboard, body) => {
        const response = await put_setEnabled(idDashboard, body);
        if (!response) return false
        const newRecently = await getUserData(idUser);
        return newRecently;
    }

    const setPerfilImage = async (file) => {
        console.log(file[0]);
        let formData = new FormData();
        formData.append("image", file[0]);
        const response = await post_perfilImage(formData);
        return response;
    }

    useEffect(() => {
        (async () => {
            await getTiendas();
            await getPlazas();
            await getUserData();
        })()
    }, []);

    return {
        plazas,
        tiendas,
        user,
        dashboard,
        getUserData,
        getPlazas,
        getTiendas,
        changePassword,
        getEnabledDashboards,
        setEnabledDashboard,
        setPerfilImage,
    }
}

export default useProvideUser;