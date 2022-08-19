import {createSlice} from '@reduxjs/toolkit';

const parametersSlice = createSlice({
    name:'parameters',
    initialState:{},
    reducers:{
        setParameters(state, action){
            return {...action.payload};
        },
        removeParameters(state, action){
            return {}
        }
    }
});

const {reducer, actions} = parametersSlice;
export const {setParameters, removeParameters} = actions;
export default reducer;