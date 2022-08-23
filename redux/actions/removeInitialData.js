import { removeUser } from "../reducers/userSlice";
import { removeAccess } from "../reducers/accessSlice";
import { removePlaces } from "../reducers/placesSlice";
import { removeShops } from "../reducers/shopSlice";
import { removeParameters } from "../reducers/parametersSlice";
import { setAuth } from "../reducers/authSlice";

const removeInitialData = () => dispatch =>{
    dispatch(removeUser());
    dispatch(removeAccess());
    dispatch(removePlaces());
    dispatch(removeShops());
    dispatch(removeParameters());
    dispatch(setAuth(false));
}

export default removeInitialData;