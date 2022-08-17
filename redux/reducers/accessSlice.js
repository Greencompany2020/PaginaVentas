import {createSlice} from '@reduxjs/toolkit';

const accessSlice = createSlice({
    name: 'access',
    initialState: [],
    reducers:{
        setAccess(state, action){
            return [...action.payload]
        },
        removeAccess(state, action){
            return []
        }
    }
});

const {actions, reducer} = accessSlice;
export const {setAccess, getDirectAcces, removeAccess} = actions;
export default reducer;