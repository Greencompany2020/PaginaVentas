import {createSlice} from '@reduxjs/toolkit'
const userSlice = createSlice({
    name: 'user',
    initialState: {
        isAdmin: false,
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
        }
    }
});


const {actions, reducer} = userSlice;
export const { setUser, removeUser, setAdmin} = actions;
export default reducer;