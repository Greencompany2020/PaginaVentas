import {createSlice} from '@reduxjs/toolkit'
const userSlice = createSlice({
    name: 'user',
    initialState: {},
    reducers: {
        setUser(state, action){
            return {...action.payload}
        },
        removeUser(state, action){
            return {}
        }
    }
});


const {actions, reducer} = userSlice;
export const { setUser, removeUser} = actions;
export default reducer;