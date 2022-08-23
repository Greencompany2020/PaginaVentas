import { setUser } from "../reducers/userSlice";
import { setAccess } from "../reducers/accessSlice";
import { setPlaces } from "../reducers/placesSlice";
import { setShops } from "../reducers/shopSlice";
import { setParameters } from "../reducers/parametersSlice";
import { setAuth } from "../reducers/authSlice";

const setInitialData = (response) => dispatch => {
    dispatch(setUser(response[0].user));
    dispatch(setAccess(response[0].dashboards));
    dispatch(setPlaces(response[1]));
    dispatch(setShops(response[2]));
    dispatch(setParameters(response[3]));
    dispatch(setAuth(true));
}

export default setInitialData;