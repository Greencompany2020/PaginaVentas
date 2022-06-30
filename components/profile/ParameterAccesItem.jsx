import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {CogIcon} from '@heroicons/react/solid';
import userService from '../../services/userServices';
import {useNotification} from '../notifications/NotificationsProvider';
import ParameterForm from '../ParameterForm';
import configuratorService from '../../services/configuratorService';

export default function ParameterAccesItem(props) {
    const service = userService();
    const configService = configuratorService();
    const sendNotification = useNotification();
    const {id, name, linkTo, isSelected, setSelected, idAccess} = props;
    const [parameters, setParameters] = useState({
        userParameters: undefined,
        accessParameters: undefined,
    })

    const hadleSelectedClose = () => {
        if(!isSelected){
            setSelected(id);
        }else{
            setSelected(undefined);
            setParameters({
                userParameters: undefined,
                accessParameters: undefined
            })
        } 
    }

    const handleSubmit = async values =>{
        try {

            await service.setAccessParameter(idAccess, values);
            sendNotification({
                type: 'OK',
                message: 'Preferencias guardadas'
            })
        } catch (error) {
            sendNotification({
                type: 'OK',
                message: 'Error al guardar preferencias'
            })
        }
    }

    useEffect(()=>{
        (async()=>{
            if(isSelected){
                try {
                    const response = await service.getAccessParameters(idAccess);
                    const responseEnabledControls = await configService.getParameters(response.idDashboard);
                    setParameters({
                        userParameters: response,
                        accessParameters: responseEnabledControls
                    })
                } catch (error) {
                    sendNotification({
                        type:'ERROR',
                        message:'Error al cargar sus preferencias'
                    })
                }
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isSelected])

    return (
        <li>
            <div className='border rounded-md'>
                <section className='h-[3rem] bg-gray-100'>
                    <div className='h-full w-full p-2 flex justify-between items-center'>
                        <Link href={linkTo}>
                            <a className='text-lg truncate text-blue-500'>{name}</a>
                        </Link>
                        <div className='space-y-2'>
                            <CogIcon width={26} className='text-gray-500 hover:text-blue-500' onClick={hadleSelectedClose}/>
                        </div>
                    </div>
                </section>
                <section className={`transition-height  transform duration-100  overflow-hidden ${isSelected ? 'h-fit' : 'h-0'}`}>
                    {isSelected && <ParameterForm submit={handleSubmit} savedParameters={parameters.userParameters} includedParameters={parameters.accessParameters} onlySelect={true}/>}
                </section>
            </div>
        </li>
    )
}

