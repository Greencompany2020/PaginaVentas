import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {CogIcon, HeartIcon ,EyeIcon, EyeOffIcon} from '@heroicons/react/solid';
import userService from '../../services/userServices';
import {useNotification} from '../notifications/NotificationsProvider';
import ParameterForm from '../ParameterForm';
import configuratorService from '../../services/configuratorService';
import NewForm from '../NewForm';

export default function ParameterAccesItem(props) {
    const service = userService();
    const configService = configuratorService();
    const sendNotification = useNotification();
    const {id, name, linkTo, isSelected, setSelected, idAccess, globalParameters, refreshParams} = props;
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
            });
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message:error?.response?.data?.message || error.message
            })
        }
    }

    const handleSetFavorite = async () => {
        try {
            const response = await service.updateGlobalParameters({favoriteAccess:idAccess});
            refreshParams(response)
            sendNotification({
                type: 'OK',
                message: 'Establecido como favorito'
            });
        } catch (error) {
            sendNotification({
                type: 'OK',
                message:error?.response?.data?.message || error.message
            });
        }
    }
    const isFavorite = () => (idAccess == globalParameters?.idAcceso ? true : false);

    const RenderForm  = () => {
        const {idDashboard} = parameters?.userParameters || false;
        if(idDashboard && (idDashboard == 20 || idDashboard == 21 || idDashboard == 12 || idDashboard == 13 || idDashboard == 29)){
            return(
                <NewForm 
                    submit={handleSubmit} 
                    userParams={parameters.userParameters}
                    dashbordParams={parameters.accessParameters} 
                />
            )
        }else
        {
            return( 
                <ParameterForm 
                    submit={handleSubmit} 
                    savedParameters={parameters.userParameters} 
                    includedParameters={parameters.accessParameters} 
                    onlySelect={true}
                />
            )
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
                    });
                } catch (error) {
                    sendNotification({
                        type:'ERROR',
                        message:error?.response?.data?.message || error.message
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
                        <div className='flex items-center space-x-2'>
                            {
                                isFavorite() ?
                                <EyeIcon width={24} className={'text-blue-500'}/> :
                                <EyeOffIcon width={24} className={'text-gray-500 hover:text-blue-500'} onClick={handleSetFavorite}/>
                            }
                            <CogIcon width={24} className='text-gray-500 hover:text-blue-500' onClick={hadleSelectedClose}/>
                        </div>
                    </div>
                </section>
                <section className={`transition-height  transform duration-100  overflow-hidden ${isSelected ? 'h-fit' : 'h-0'}`}>
                    {isSelected && <RenderForm/>}
                </section>
            </div>
        </li>
    )
}

