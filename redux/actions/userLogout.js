import authService from "../../services/authService";
import { removeUser } from "../reducers/userSlice";
import { removeAccess } from "../reducers/accessSlice";
import { removePlaces } from "../reducers/placesSlice";
import { removeShops } from "../reducers/shopSlice";
import { removeParameters } from "../reducers/parametersSlice";
import { setAuth } from "../reducers/authSlice";
import { setIsFetching, setMessage } from "../reducers/systemSlice";
import jsCookie from 'js-cookie'

const userLogout = () => async dispatch => {
    try {
        dispatch(setIsFetching(true));
        const service = authService();
        await service.logout();
        dispatch(removeUser());
        dispatch(removeAccess());
        dispatch(removePlaces());
        dispatch(removeShops());
        dispatch(removeParameters());
        dispatch(setAuth(false));
        dispatch(setIsFetching(false));
        jsCookie.remove('accessToken');
        jsCookie.remove('jwt');
    } catch (error) {
        dispatch(setMessage({
            type: 'ERROR',
            message: error.message
        }))
        dispatch(setIsFetching(true));
        dispatch(setAuth(false));
    }
}

export default userLogout