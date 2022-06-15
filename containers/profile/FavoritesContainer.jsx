import React from 'react';
import { useUser } from '../../context/UserContext';
import FavoriteList from '../../components/profile/FavoriteList';

export default function FavoritesContainer(props) {
    const {user,dashboard, setEnabledDashboard} = useUser();
    const setFavorite = (id, isFavorite) =>{
        const enabled = (isFavorite == 'Y') ? 'N' : 'Y'
        setEnabledDashboard(user.Id,id, enabled);
    }
    return (
        <div className=''>
            <FavoriteList 
                items={dashboard}
                setFavorite={setFavorite}
            /> 
        </div>
    )
}
