import FavoriteList from '../../components/profile/FavoriteList';
import userService from '../../services/userServices';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import {useSelector, useDispatch} from 'react-redux';
import { setAccess } from '../../redux/reducers/accessSlice';

export default function FavoritesContainer(props) {
    const service = userService();
    const { access } = useSelector(state => state);
    const dispatch = useDispatch();
    const sendNotification = useNotification();



    const setFavorite = async(id, isFavorite) =>{
        try {
            const enabled = (isFavorite == 'Y') ? 'N' : 'Y'
            const response = await service.setFavoriteAccess(id,enabled);
            dispatch(setAccess(response));
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message:error.response.data.message || error.message
            });
        }
    }

    return (
        <FavoriteList 
            items={access}
            setFavorite={setFavorite}
        /> 
    )
}
