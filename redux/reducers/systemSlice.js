import { createSlice } from "@reduxjs/toolkit";

const systemSlice = createSlice({
    name:'system',
    initialState:{
        isFetching: false,
        messages: [],
    },
    reducers:{
        setIsFetching(state, actions){
            return {...state, isFetching:actions.payload};
        },
        setMessage(state, action){
            return {...state, messages:[...state.messages, action.payload]};
        },
        removeMessage(state, action){
            const arr = state.messages.filter(item => item !== action.payload);
            return {...state, messages:[...arr]};
        }
    }
});

const {reducer, actions} = systemSlice;
export const {setIsFetching, setMessage, removeMessage} = actions;
export default reducer;