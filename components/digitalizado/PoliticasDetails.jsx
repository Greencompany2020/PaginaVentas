import React, { useEffect, useState } from 'react';
import digitalizadoService from '../../services/digitalizadoService';
import { useNotification } from '../notifications/NotificationsProvider';
import { ExternalLinkIcon, PencilIcon } from '@heroicons/react/outline';
import {v4} from 'uuid';
import LoaderComponentBas from '../LoaderComponentBas';

export default function PoliticasDetails({ item, handleOpenOne, handleUpdate, handleAddLog}) {
    const service = digitalizadoService();
    const sendNotification = useNotification();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (item) {
                try {
                    setIsLoading(true);
                    const response = await service.getPoliticasLog(item.clave);
                    setData(response);
                } catch (error) {
                    sendNotification({
                        type: 'ERROR',
                        message: error?.response?.message || error.message,
                    });
                } finally{
                    setIsLoading(false);
                }
            }
        })()
    }, [item]);

    if(isLoading){
        return(
            <div className='w-full overflow-auto'>
                <div className='w-full h-full grid place-items-center'>
                    <LoaderComponentBas isLoading={isLoading}/>
                </div>
            </div>
        )
    }

    return (
        <div className='w-full  overflow-auto'>
            <div className="flex items-center justify-end space-x-3 mb-4">
                <button className="primary-btn w-32" onClick={handleAddLog}>Nueva</button>
            </div>
            <div className='overflow-y-auto'>
                <table className={"table-politicas w-full"}>
                    <thead>
                        <tr>
                            <th>Version</th>
                            <th>F.Actualizacion</th>
                            <th>F.Carga</th>
                            <th className="w-16">OPC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.politicas &&
                            data.politicas.map(item => (
                                <tr key={v4()}>
                                    <td>{item.version}</td>
                                    <td>{item.fechaActualizacion}</td>
                                    <td>{item.fechaCarga}</td>
                                    <td>
                                        <div className="flex items-center space-x-2">
                                            <ExternalLinkIcon width={24} onClick={() => handleOpenOne(item.id)}/>
                                            <PencilIcon width={24} onClick={() => handleUpdate(item)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
