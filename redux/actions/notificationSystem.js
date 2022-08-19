import { setMessage, removeMessage } from "../reducers/systemSlice";
import { v4 } from "uuid";


export const addNotification = (type, message) => dispatch => {
    dispatch(setMessage({key:v4(), type, message}));
}

export const removeNotification = notification => dispatch => {
    dispatch(removeMessage(notification));
}


export const handleProgress = () => {

    let isFetching = false;
    const handle = progress => {
        const loadedPorcent = (progress.loaded / progress.total) * 100;
        isFetching = progress;
    }
  
    return {handle};
}


