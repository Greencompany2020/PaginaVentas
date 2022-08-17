import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name:'isAuth',
    initialState: false,
    reducers:{
        setAuth(state, action){
            return action.payload;
        }
    }
});

const {reducer, actions} = authSlice;
export const {setAuth} = actions;
export default reducer;