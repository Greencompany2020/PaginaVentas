import React from 'react';
import { useField } from 'formik';

export default function Input(props) {
    const {label,...rest} = props;
    const [field, meta] = useField(props);
    return (
        <label className={`w-full flex flex-col text-sm font-semibold text-gray-600 ${props?.flex}`} htmlFor={props?.id || props?.name}>
            <span>{label}</span>
            <input  {...rest} {...field} className={'h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none'}/>
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}
