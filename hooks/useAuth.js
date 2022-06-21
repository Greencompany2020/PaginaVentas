import {useState, useEffect} from 'react';
import userService from '../services/userServices';

export default function useProviderAuth(){
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState();
    const [tiendas, setTiendas] = useState();
    const [plazas, setPlazas] = useState();
    const service = userService();

    const refreshUser = async () => {
       try {
            const response = await service.getUser();
            if(response) setUser(response);
       } catch (error) {
            throw error;
       }
    }
    

    useEffect(()=>{
        (async()=>{
            if(auth){
                try {
                    //get all data
                    const responseUser = await service.getUser();
                    const responsePlazas = await service.getPlazas();
                    const responseTiendas = await service.getTiendas();

                    //set all data
                    setUser(responseUser);
                    setPlazas(responsePlazas);
                    setTiendas(responseTiendas);
                } catch (error) {
                console.log(error);
                }
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[auth])

    return {
        plazas,
        tiendas,
        user,
        setAuth,
        refreshUser,
    }
}