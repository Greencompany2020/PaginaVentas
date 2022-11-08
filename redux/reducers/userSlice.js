import {createSlice} from '@reduxjs/toolkit'
const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAdmin: false,
        seeHistory: []
    },
    reducers: {
        setUser(state, action){
            return {...action.payload}
        },
        removeUser(state, action){
            return {}
        },
        setAdmin(state, action){
            return {...state, isAdmin:action.payload}
        },
        setHistory(state, action){
            return {...state, seeHistory:action.payload}
        }
    }
});


const {actions, reducer} = userSlice;
export const { setUser, removeUser, setAdmin, setHistory} = actions;
export default reducer;