import { useState, useEffect} from 'react';
import FavoriteList from '../../components/profile/FavoriteList';
import userService from '../../services/userServices';
import { useNotification } from '../../components/notifications/NotificationsProvider';

export default function FavoritesContainer(props) {
    const service = userService();
    const sendNotification = useNotification();
    const [favorites, setFavorites] = useState(undefined);

    useEffect(()=>{
        (async()=>{
           try {
            const response = await service.getUserAccess();
            setFavorites(response)
           } catch (error) {
            sendNotification({
                type:'ERROR',
                message:'Error al consultar sus accesos',
            });
           }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const setFavorite = async(id, isFavorite) =>{
        try {
            const enabled = (isFavorite == 'Y') ? 'N' : 'Y'
            const response = await service.setDirectAccess(id,enabled);
            if(response){
                const refreshFavorites = await service.getUserAccess();
                setFavorites(refreshFavorites);
            }
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message:error.message,
            });
        }
    }

    return (
        <FavoriteList 
            items={favorites}
            setFavorite={setFavorite}
        /> 
    )
}
