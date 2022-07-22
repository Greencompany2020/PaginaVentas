import React, {useState, useEffect, useCallback} from "react";
import {EmojiSadIcon, EmojiHappyIcon, UploadIcon} from '@heroicons/react/solid'

export default function Notification(props){
    const {id,message, time,dispatch, type, progress } = props;
    const [style, setStyle] = useState('bg-gray-100')
    const [onScreen, setOnScreen] = useState(false);

    const RenderIcon = () => {
       if(type === 'ERROR') return <EmojiSadIcon  width={32} className='text-white'/>
       if(type === 'OK') return <EmojiHappyIcon width={32} className='text-white'/>
       return <></>
    }

    const handleCloseNotification = () => {
        setOnScreen(true);
        setTimeout(()=>{
            handleUnmount();
        },time || 3000)
    }

    const handleUnmount = () =>{
        setOnScreen(false)
        setTimeout(() => {
            dispatch({type:'REMOVE_NOTIFICATION', id})
        }, 400);
    }

    useEffect(()=>{
        switch (type) {
            case 'ERROR':
                setStyle('bg-red-400');
                handleCloseNotification();
                break;

            case 'OK':
                setStyle('bg-blue-400');
                handleCloseNotification();
                break;
        
            case 'PROGRESS':
                setStyle('bg-slate-200');
                break;

            default:
                setStyle(prev => prev)
                handleCloseNotification();
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return(
        <div 
            className={`
                h-18 overflow-hidden shadow-xl 
                rounded-md bg-gray-200 p-2 
                transform ${!onScreen && 'translate-x-[calc(_100%_+_5rem)]'} 
                transition duration-200 ease-in-out
                ${style}
            `}
        >
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-2">
                    <RenderIcon/>
                    <p className="truncate">{message}</p>
                </div>
            </div>
        </div>
    )
}