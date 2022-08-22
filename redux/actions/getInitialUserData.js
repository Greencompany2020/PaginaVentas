import authService from "../../services/authService";
import { setUser } from "../reducers/userSlice";
import { setAccess } from "../reducers/accessSlice";
import { setPlaces } from "../reducers/placesSlice";
import { setShops } from "../reducers/shopSlice";
import { setParameters } from "../reducers/parametersSlice";
import { setIsFetching, setMessage } from "../reducers/systemSlice";
import { setAuth } from "../reducers/authSlice";


const getInitialUserData = () => async dispatch => {
    try {
        dispatch(setIsFetching(true));
        const service = authService();
        const response = await service.getUserData();
        dispatch(setUser(response[0].user));
        dispatch(setAccess(response[0].dashboards));
        dispatch(setPlaces(response[1]));
        dispatch(setShops(response[2]));
        dispatch(setParameters(response[3]));
        dispatch(setIsFetching(false));
        dispatch(setAuth(true))
    } catch (error) {
        dispatch(setMessage({
            type: 'ERROR',
            message: error.message
        }))
        dispatch(setIsFetching(true));
        dispatch(setAuth(false));
        throw error;
    }
}

export default getInitialUserData;