import React from 'react';
import PropTypes from 'prop-types';
import {XIcon} from '@heroicons/react/solid'

export default function Drawer(props) {
    const {children, expand, handleExpand} = props
  return (
    <>
        <aside className={`fixed overflow-y-auto w-screen md:w-[28rem] h-screen bg-white right-0 top-0 z-20 transform ${!expand && "translate-x-full"} transition duration-200 ease-in-out`}>
            <div className='relative h-[5%] top-0 flex items-center p-2'>
                <XIcon width={32} className='text-gray-500 cursor-pointer' onClick={handleExpand}/>
            </div>
            <section className="p-4 overflow-y-auto h-[95%]">
                {children}
            </section>
        </aside>
        {/*Overlay*/}
        <div className={`${!expand && 'hidden'} absolute top-0 right-0 w-screen h-screen bg-gray-500 z-10 opacity-80`}></div>
    </>
  )
}

Drawer.defaultProps={
    expand: false,
}

Drawer.propTypes={
    children: PropTypes.func,
    expand: PropTypes.bool.isRequired,
    handleExpand: PropTypes.func.isRequired
}
