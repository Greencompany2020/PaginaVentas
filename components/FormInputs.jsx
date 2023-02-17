import React, { useState, useMemo, useCallback } from 'react'
import { useField } from 'formik';
import Image from 'next/image';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { useDropzone } from 'react-dropzone';


export const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <label className={`flex flex-col font-semibold text-sm  text-gray-600 ${props.disabled && 'text-gray-100'}`} htmlFor={props?.id || props?.name}>
            <span className=''>{label}</span>
            <input
                className={`h-8 border rounded-md pl-2 ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400'} disabled:bg-gray-100 disabled:border-gray-100`}
                {...field} {...props}
            />
            {(meta.touched && meta.error) && <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const SelectInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <label className={`flex flex-col font-semibold text-sm text-gray-600 ${props.disabled && 'text-gray-100'}`} htmlFor={props?.id || props?.name}>
            <span className=''>{label}</span>
            <select
                className={`h-8 border rounded-md pl-2 ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400'} disabled:bg-gray-100 disabled:border-gray-100`}
                {...field} {...props}
            >
                {props.children}
            </select>
            {(meta.touched && meta.error) && <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}


export const LoginInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <label className='block' htmlFor={props?.id || props?.name}>
            {label}
            <input
                className={`w-full h-10 border-2 rounded-md pl-2 outline-none text-center text-xl ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400'}`}
                {...field} {...props}
            />
            {(meta.touched && meta.error) && <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const PasswordViewInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const [isVisible, setIsVisible] = useState(false);
    const { type, ...rest } = props;
    return (
        <label className='flex flex-col font-semibold text-sm   text-gray-600 ' htmlFor={props?.id || props?.name}>
            <span className=''>{label}</span>
            <div className={`flex  h-10 border-2 rounded-md`}>
                <input
                    type={isVisible ? 'text' : 'password'}
                    className='w-full h-full outline-none pl-2'
                    {...field} {...rest}
                />
                <div className=' right-0 flex items-center justify-center h-full w-8 bg-gray-100'>
                    {isVisible ?
                        <EyeOffIcon width={24} onClick={() => setIsVisible(false)} className='text-blue-400' /> :
                        <EyeIcon width={24} onClick={() => setIsVisible(true)} className='text-gray-600' />}
                </div>
            </div>
            {(meta.touched && meta.error) && <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const ResetViewInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const [isVisible, setIsVisible] = useState(false);
    const { type, ...rest } = props;
    return (
        <label className='block' htmlFor={props?.id || props?.name}>
            {label}
            <div className={`flex overflow-hidden h-10 border-2 rounded-md ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400'}`}>
                <input
                    type={isVisible ? 'text' : 'password'}
                    className='w-full h-full outline-none pl-2 text-center text-xl'
                    {...field} {...rest}
                />
                <div className=' right-0 flex items-center justify-center h-full w-8 bg-gray-100'>
                    {isVisible ?
                        <EyeOffIcon width={24} onClick={() => setIsVisible(false)} className='text-blue-400' /> :
                        <EyeIcon width={24} onClick={() => setIsVisible(true)} className='text-gray-500' />}
                </div>
            </div>
            {(meta.touched && meta.error) && <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}

export const CheckBoxInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const { type, ...rest } = props;
    return (
        <label className={`flex items-center space-x-1 font-semibold  text-gray-600 text-sm ${props.disabled && 'text-gray-100'}`} htmlFor={props?.id || props?.name}>
            <input type='checkbox' value={props.value} checked={meta?.value || false} {...field} {...rest} />
            <span className='normal-case'>{label}</span>
        </label>
    )
}

export const RadioInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const isChecked = (meta?.value == props?.value);
    return (
        <label className={`flex items-center space-x-1 font-semibold text-sm  text-gray-600 ${props.disabled && 'text-gray-100'}`}>
            <input {...field} {...props} type='radio' checked={isChecked} />
            <span className='normal-case'>{label}</span>
        </label>
    )
}

export const RadioImageInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    const isChecked = (meta?.value == props?.value);
    return (
        <label className={`flex items-center space-x-1 font-semibold text-sm border p-1 rounded-md text-gray-600 ${isChecked ? 'border-blue-400' : 'border-slate-100'} ${props.disabled && 'opacity-40'}`}>
            <figure className='relative w-6 h-6' >
                <Image src={props.image} layout='fill' alt='image' className='' />
            </figure>
            <span className='normal-case'>{label}</span>
            <input {...field} {...props} type='radio' checked={isChecked} className='hidden' />
        </label>
    )
}


export const TextAreaInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <label className={`flex flex-col font-semibold text-sm  text-gray-600 ${props.disabled && 'text-gray-100'}`} htmlFor={props?.id || props?.name}>
            <span className=''>{label}</span>
            <textarea
                className={`h-24 border rounded-md pl-2 ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400'} disabled:bg-gray-100 disabled:border-gray-100`}
                {...field} {...props}
            />
            {(meta.touched && meta.error) && <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}



