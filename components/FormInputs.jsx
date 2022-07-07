import React, { useState } from 'react'
import { useField } from 'formik';
import {EyeIcon, EyeOffIcon} from '@heroicons/react/outline'

export const TextInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return(
        <label className='flex flex-col font-semibold  text-gray-600 ' htmlFor={props?.id || props?.name}>
            <span className='mb-1'>{label}</span>
            <input 
                className={`h-10 border-2 rounded-md pl-2 ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400' }`}  
                {...field} {...props} 
            />
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const SelectInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return(
        <label className='flex flex-col font-semibold  text-gray-600' htmlFor={props?.id || props?.name}>
            <span className='mb-1'>{label}</span>
            <select 
                className={`h-10 border-2 rounded-md pl-2 ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400' }`}  
                {...field} {...props}
            />
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const LoginInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return(
        <label className='flex flex-col font-semibold  text-gray-600 ' htmlFor={props?.id || props?.name}>
            <span className='mb-1'>{label}</span>
            <input 
                className={`h-10 border-2 rounded-md pl-2 outline-none text-center text-xl ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400' }`}  
                {...field} {...props} 
            />
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const PasswordViewInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    const [isVisible, setIsVisible] = useState(false);
    const  {type, ...newProps} = props;
    return(
        <label className='flex flex-col font-semibold  text-gray-600 ' htmlFor={props?.id || props?.name}>
            <span className='mb-1'>{label}</span>
            <div className={`flex  h-10 border-2 rounded-md`}>
                <input
                    type= { isVisible ? 'text' : 'password'}
                    className='w-full h-full outline-none pl-2'  
                    {...field} {...newProps}
                />
                <div className=' right-0 flex items-center justify-center h-full w-8 bg-gray-100'>
                    {isVisible ? 
                        <EyeOffIcon width={24} onClick={() => setIsVisible(false)} className='text-blue-400'/> : 
                        <EyeIcon width={24} onClick={() => setIsVisible(true)} className='text-gray-600'/>}
                </div>
            </div>
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const ResetViewInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    const [isVisible, setIsVisible] = useState(false);
    const  {type, ...newProps} = props;
    return(
        <label className='flex flex-col font-semibold  text-gray-600 ' htmlFor={props?.id || props?.name}>
            <span className='mb-1'>{label}</span>
            <div className={`flex overflow-hidden h-10 border-2 rounded-md ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400' }`}>
                <input
                    type= { isVisible ? 'text' : 'password'}
                    className='w-full h-full outline-none pl-2 text-center text-xl'  
                    {...field} {...newProps}
                />
                <div className=' right-0 flex items-center justify-center h-full w-8 bg-gray-100'>
                    {isVisible ? 
                        <EyeOffIcon width={24} onClick={() => setIsVisible(false)} className='text-blue-400'/> : 
                        <EyeIcon width={24} onClick={() => setIsVisible(true)} className='text-gray-500'/>}
                </div>
            </div>
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}