import {useState} from 'react';
import userService from '../services/userServices';
import { useNotification } from '../components/notifications/NotificationsProvider';

export default function useProviderAuth(){
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState();
    const [globalParameters, setGlobalParameters] = useState({});
    const [tiendas, setTiendas] = useState();
    const [plazas, setPlazas] = useState();
    const service = userService();
    const sendNotification = useNotification();

    const refreshUser = async () => {
       try {
            const response = await service.getUser();
            if(response) setUser(response);
       } catch (error) {
        sendNotification({
            type:'ERROR',
            message:error.message,
           })
       }
    }

    const refreshGlobalParameters = async  () =>{
        try {
            const response = await service.getGlobalParameters();
            setGlobalParameters(response);
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message:error.message,
               })
        }
    }

    const getAllParameters = async() => {
        try {
            //get all data
            const responseUser = await service.getUser();
            const responsePlazas = await service.getPlazas();
            const responseTiendas = await service.getTiendas();
            const responseGlobalParameters = await service.getGlobalParameters();

            //set all data
            setUser(responseUser);
            setPlazas(responsePlazas);
            setTiendas(responseTiendas);
            setGlobalParameters(responseGlobalParameters);
        } catch (error) {
           sendNotification({
            type:'ERROR',
            message:error.message,
           })
        }
    }
    
    return {
        plazas,
        tiendas,
        user,
        setAuth,
        refreshUser,
        globalParameters,
        refreshGlobalParameters,
        getAllParameters,
    }
}