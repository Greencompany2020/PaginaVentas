import React from 'react';
import { useField } from 'formik';
import { isSafari } from 'react-device-detect';

export default function Input(props) {
    const {label,...rest} = props;
    const [field, meta] = useField(props);

    const styledForNotSafari = 'w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none';
    const styledForSafari = 'w-12 bg-gray-300 border border-slate-400 rounded h-8 ';

    const styledForDivNotSafari = '';
    const styledForDivSafari = 'flex items-center space-x-2';

    const isDateAndSafari = (type) => (isSafari && type === 'date');


    return (
        <label className={`w-full flex flex-col text-sm font-semibold text-gray-600 ${rest?.flex}`} htmlFor={props?.id || props?.name}>
             <span>{label}</span>
             <div className={isDateAndSafari(props.type) ? styledForDivSafari : styledForDivNotSafari}>
                <input  {...rest} {...field}  className={isDateAndSafari(rest.type) ? styledForSafari : styledForNotSafari}/>
                {isDateAndSafari() && <span className='font-bold'>{meta.value}</span>}
            </div>
            {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}
