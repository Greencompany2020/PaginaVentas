import {createSlice} from '@reduxjs/toolkit';

const shopSlice = createSlice({
    name:'shops',
    initialState:[],
    reducers:{
        setShops(state, action){
            return [...action.payload]
        },
        removeShops(staten, action){
            return []
        }
    }
});

const {reducer, actions} = shopSlice;
export const {setShops, removeShops} = actions;
export default reducer;