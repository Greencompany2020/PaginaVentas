import React from 'react'
import { useField } from 'formik';

export default function Checkbox(props) {
    const [field, meta] = useField(props);
    const {label,type, ...rest} = props;
    return(
        <label className={`flex items-center space-x-1 font-semibold  text-gray-600 text-sm ${props.disabled && 'text-gray-100'}`} htmlFor={props?.id || props?.name}>
            <input type='checkbox' checked={meta?.value || false} {...field} {...rest}/>
            <span className='normal-case truncate'>{label}</span>
        </label>
    )
}
