import {combineReducers} from '@reduxjs/toolkit';

import userReducer from './userSlice';
import parametersReducer from './parametersSlice';
import accessReducer from './accessSlice';
import shopsReducer from './shopSlice';
import placesRducer from './placesSlice';
import authReducer from './authSlice';
import systemReducer from './systemSlice';

const rootReducers = combineReducers({
    user: userReducer,
    parameters: parametersReducer,
    access:accessReducer,
    shops: shopsReducer,
    places: placesRducer,
    isAuth: authReducer,
    system: systemReducer,
});

export default rootReducers;