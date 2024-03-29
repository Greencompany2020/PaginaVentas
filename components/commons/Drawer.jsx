import React,{useRef} from 'react';
import PropTypes from 'prop-types';
import {XIcon} from '@heroicons/react/solid';
import useClickOutside from '../../hooks/useClickOutside';

export default function Drawer(props) {
    const {children, expand, handleExpand, keepScreen, title} = props;
    const drawerRef = useRef(null);
    useClickOutside(drawerRef, ()=>{
        if(expand){
            handleExpand();
        }
    })
    return (
        <>
            <aside 
                className={`fixed overflow-y-auto w-screen md:w-[28rem] h-screen bg-white right-0 top-0 z-20 transform ${!expand && "translate-x-full"} transition duration-200 ease-in-out`}
                ref={drawerRef}
            >
                <div className='relative h-[5%] top-0 flex items-center p-2'>
                    <XIcon width={28} className='text-gray-500 cursor-pointer' onClick={handleExpand}/>
                    <h2 className="ml-4 font-semibold text-lg">{title}</h2>
                </div>
                <section className="p-4 overflow-y-auto h-[95%]">
                    {children}
                </section>
            </aside>
            {/*Overlay*/}
            <div className={`${!expand && 'hidden'}  fixed top-0 right-0 w-screen h-screen bg-gray-500 z-10 opacity-80`}></div>
        </>
    )
}

Drawer.defaultProps={
    expand: false,
    keepScreen: false,
}

Drawer.propTypes={
    expand: PropTypes.bool.isRequired,
    handleExpand: PropTypes.func.isRequired,
    keepScreen: PropTypes.bool
}
