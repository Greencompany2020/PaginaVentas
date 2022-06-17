import { useReducer, useCallback} from 'react'

const initialState = {
    show: false,
    message: '',
    type: '',
}

export default function useProvideAlert(){

    const reducer = (state, action) => {
        switch(action.type){
            case 'SHOW_ALERT':
                return {...state, show:true, message:action.payload.message, type:action.payload.type};
            case 'HIDE_ALERT':
                return {...state, show:false};
            case 'CLEAR_ALERT' :
                return {...state,message:'', type:''}
            default:
                return state;
        }
    }
    const [state, dispatch] = useReducer(reducer, initialState);

    const showAlert = (message = '', type = 'WARNING', duration = 3000) => {
        dispatch({type: 'SHOW_ALERT', payload:{message, type, duration}});
        closerHandle(duration);
    }

    const closerHandle = duration => {
        setTimeout(() => {
            dispatch({type:'HIDE_ALERT'});
        }, duration);
        setTimeout(() => {
            dispatch({type:'CLEAR_ALERT'})
        },duration + 1000);
    }
    
    return {
        state,
        showAlert
    }
}