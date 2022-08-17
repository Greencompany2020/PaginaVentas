import { configureStore } from '@reduxjs/toolkit';
import rootReducers from './reducers';
import logger from 'redux-logger';

const store = configureStore({
    reducer: rootReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(logger)
});

export default store;