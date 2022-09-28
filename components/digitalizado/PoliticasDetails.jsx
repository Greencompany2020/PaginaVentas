import React, { useEffect, useState } from 'react';
import digitalizadoService from '../../services/digitalizadoService';
import { useNotification } from '../notifications/NotificationsProvider';
import { ArrowNarrowDownIcon, ExternalLinkIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { v4 } from 'uuid';
import LoaderComponentBas from '../LoaderComponentBas';
import Paginate from '../paginate';

export default function PoliticasDetails({ item, handleOpenOne, handleUpdate, handleAddLog, isAdmin, handleDelete }) {
    const service = digitalizadoService();
    const sendNotification = useNotification();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getInitialData = async () => {
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
            }
            finally {
                setIsLoading(false);
            }
        }

    }

    const handleAdd = async () => {
        const response =  await handleAddLog();
        if(response) await getInitialData();
    }

    const handleEdit = async id => {
        const response =  await handleUpdate(id);
        if(response) await getInitialData();
    }

    const handleDel = async id => {
        const response =  await handleDelete(id);
        if(response) await getInitialData();
    }

    useEffect(() => {
        (async () => {
            await getInitialData();
        })()
    }, [item]);


    if (isLoading) {
        return (
            <div className='w-full overflow-auto'>
                <div className='w-full h-full grid place-items-center'>
                    <LoaderComponentBas isLoading={isLoading} />
                </div>
            </div>
        )
    }

    return (
        <div className='w-full  overflow-auto'>
            <div className="bg-gray-100 p-2 rounded-md mb-6">
                <p className="font-semibold">
                    <span className="block">Politica: {item?.clave}</span>
                    <span className="block">Descripcion: {item?.descripcion}</span>
                </p>
            </div>
            {
                isAdmin &&
                <div className="flex items-center mb-2">
                    <button className="primary-btn w-32" onClick={handleAdd}>Nueva</button>
                </div>
            }

            <div className='overflow-y-auto'>
                <Paginate
                    data={data?.politicas}
                    showItems={5}
                    options={{
                        labelSelector: "Mostrar",
                        optionRange: [20, 50, 100],
                        searchBy: ["clave", "descripcion", "empresa"],
                    }}
                >
                    <Table handleOpenOne={handleOpenOne} handleUpdate={handleEdit} isAdmin={isAdmin} handleDelete={handleDel} />
                </Paginate>
            </div>
        </div>
    )
}

function Table({ items, handleOpenOne, handleUpdate, isAdmin, handleDelete }) {

    return (
        <table className={"table-politicas w-full"}>
            <thead>
                <tr>
                    <th>Version</th>
                    <th>Inicio Vigencia</th>
                    <th>F.Actualizacion</th>
                    <th>F.Carga</th>
                    <th className="w-16">OPC</th>
                </tr>
            </thead>
            <tbody>
                {
                    items &&
                    items.map(item => (
                        <tr key={v4()} className={item?.vigente && 'table-politicas--vigente'}>
                            <td>{item.version}</td>
                            <td>{item.fechaVigencia}</td>
                            <td>{item.fechaActualizacion}</td>
                            <td>{item.fechaCarga}</td>
                            <td>
                                <div className="flex items-center space-x-2">
                                    <ExternalLinkIcon width={24} onClick={() => handleOpenOne(item.id)} />
                                    {
                                        isAdmin &&
                                        <>
                                            <PencilIcon width={24} onClick={() => handleUpdate(item)} />
                                            <TrashIcon width={24} onClick={() => handleDelete(item.version)} />
                                        </>

                                    }
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}
