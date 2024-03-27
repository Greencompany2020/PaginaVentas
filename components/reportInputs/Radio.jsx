import React from 'react'
import { useField } from 'formik';

export default function Checkbox(props) {
    const [field, meta] = useField(props);
    const {label,type, ...rest} = props;

    const isCheck = () => {
        if(typeof meta?.value === 'string' && typeof props?.value === 'string'){
            return meta?.value === props?.value;
        }
        else {
            return  meta?.value === props?.value
        }
    }

    return(
        <label className={`flex items-center space-x-1 font-semibold  text-gray-600 text-sm ${props.disabled && 'text-gray-100'}`} htmlFor={props?.id || props?.name}>
            <input type='radio' checked={isCheck()} {...field} {...rest}/>
            <span className='normal-case truncate'>{label}</span>
        </label>
    )
}
