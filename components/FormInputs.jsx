import React from 'react'
import { useField } from 'formik'

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
                className={`h-10 border-2 rounded-md pl-2 text-center text-xl ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400' }`}  
                {...field} {...props} 
            />
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}