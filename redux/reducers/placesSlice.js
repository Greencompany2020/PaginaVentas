import {createSlice} from '@reduxjs/toolkit';

const placeSlice = createSlice({
    name:'places',
    initialState:[],
    reducers:{
        setPlaces(state, action){
            return [...action.payload];
        },
        removePlaces(state, action){
            return [];
        }
    }
});

const {reducer, actions} = placeSlice;
export const {setPlaces, removePlaces} = actions;
export default reducer;