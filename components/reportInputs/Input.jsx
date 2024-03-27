import React from 'react';
import { useField } from 'formik';
import { isSafari, isMobile } from 'react-device-detect';

export default function Input(props) {
    const {label,...rest} = props;
    const [field, meta] = useField(props);
    const isDateAndSafari = (type) => (isSafari && !isMobile && type === 'date');


    return (
        <label className={`w-full flex flex-col text-sm font-semibold text-gray-600 ${rest?.flex}`} htmlFor={props?.id || props?.name}>
             <span>{label}</span>
             <div className={'relative flex items-center space-x-2'}>
                <input  {...rest} {...field}  className={'w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none'}/>
                {isDateAndSafari(props.type) && <span className='absolute right-4'>{meta.value}</span>}
            </div>
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}
