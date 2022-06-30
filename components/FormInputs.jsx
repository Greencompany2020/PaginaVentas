import React from 'react'
import { useField } from 'formik'

export const TextInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return(
        <label className={`flex flex-col font-semibold  text-gray-600 ${props.width}`} htmlFor={props?.id || props?.name}>
            {label}
            <input className={`h-8 border rounded-sm border-slate-400 pl-2 ${props.elementwidth}`} {...field} {...props} />
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500'>{meta.error}</span>}
        </label>
    )
}

export const SelectInput = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return(
        <label className={`flex flex-col font-semibold  text-gray-600 ${props.width}`} htmlFor={props?.id || props?.name}>
            {label}
            <select className={`h-8 border rounded-sm border-slate-400 pl-2 ${props.elementwidth}`} {...field} {...props}/>
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500'>{meta.error}</span>}
        </label>
    )
}