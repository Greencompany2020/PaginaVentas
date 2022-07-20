import React,{useReducer, createContext, useContext} from "react";
import {v4} from 'uuid'
import Notification from "./Notification";

const NotificationContext = createContext()

export default function NotificationProvide(props){
    const {children} = props;
    const [state, dispatch] = useReducer((state, action)=>{
        switch (action.type){
            case "ADD_NOTIFICATION":
                return [...state, {...action.payload}];
            case "REMOVE_NOTIFICATION":
                return state.filter(el => el.id !== action.id);
            default:
                return state;
        }
    },[]);

    return(
        <NotificationContext.Provider value={dispatch}>
            <div className="fixed bottom-8 right-8 w-[16rem] md:w-[20rem] space-y-4 z-30">
                {state.map(note => {
                    return <Notification key={note.id} {...note} dispatch={dispatch}/>
                })}
            </div>
            {children}
        </NotificationContext.Provider>
    )
}

//Hooks
export const useNotification = () => {
    const dispatch = useContext(NotificationContext);
    return (props) => {
        dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: v4(),
              ...props
            }
        });
    }
}