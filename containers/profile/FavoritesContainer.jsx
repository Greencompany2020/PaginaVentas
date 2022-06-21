import { useState, useEffect} from 'react';
import FavoriteList from '../../components/profile/FavoriteList';
import userService from '../../services/userServices';
import { useAuth } from '../../context/AuthContext';

export default function FavoritesContainer(props) {
    const service = userService();
    const {user} = useAuth();
    const [favorites, setFavorites] = useState(undefined);

    useEffect(()=>{
        (async()=>{
           try {
            const response = await service.getUserAccess();
            setFavorites(response)
            console.log(response);
           } catch (error) {
            console.error(error);
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
            console.error(error);
        }
    }

    return (
        <div className=''>
            <FavoriteList 
                items={favorites}
                setFavorite={setFavorite}
            /> 
        </div>
    )
}
