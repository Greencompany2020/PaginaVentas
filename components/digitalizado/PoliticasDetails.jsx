import React, { useEffect, useState } from 'react';
import digitalizadoService from '../../services/digitalizadoService';
import { useNotification } from '../notifications/NotificationsProvider';
import { ExternalLinkIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/outline';
import { v4 } from 'uuid';
import LoaderComponentBas from '../LoaderComponentBas';
import Paginate from '../paginate';

export default function PoliticasDetails({ item, handleOpenOne, handleUpdate, handleAddLog, isAdmin, handleDelete, getDetails }) {
    const service = digitalizadoService();
    const sendNotification = useNotification();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const getInitialData = async () => {
        if (item) {
            try {
                setIsLoading(true);
                const response = await getDetails();
                setData(response);
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message:error.response?.data?.message,
                });
            }
            finally {
                setIsLoading(false);
            }
        }

    }

    const handleAdd = async () => {
        const response = await handleAddLog();
        if (response) await getInitialData();
    }

    const handleEdit = async id => {
        const response = await handleUpdate(id);
        if (response) await getInitialData();
    }

    const handleDel = async id => {
        const response = await handleDelete(id);
        if (response) await getInitialData();
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
                <div className="flex items-center mb-8">
                    <button className="primary-btn w-32 flex items-center" onClick={handleAdd}>
                        <PlusIcon width={24} className='mr-2'/>
                        <span>Agregar</span>
                    </button>
                </div>
            }

            <div className='overflow-y-auto'>
                <Paginate
                    data={data?.politicas}
                    showItems={5}
                    options={{
                        labelSelector: "Mostrar",
                        optionRange: [20, 50, 100],
                        searchBy: ["version", "fechaVigencia", "fechaActualizacion", "fechaAutorizacion", "fechaCarga"],
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
        <table className={"table-politicas w-full mt-4 mb-4"}>
            <thead>
                <tr>
                    <th>Version</th>
                    <th>Inicio Vigencia</th>
                    <th className='hidden md:table-cell'>F.Autorizacion</th>
                    <th className='hidden md:table-cell'>F.Actualizacion</th>
                    <th className='hidden md:table-cell'>F.Modificacion</th>
                    <th className='hidden md:table-cell'>F.Carga</th>
                    <th className="w-16">OPC</th>
                </tr>
            </thead>
            <tbody>
                {
                    items &&
                    items.map(item => (
                        <tr key={v4()} className={` ${item?.vigente && 'table-politicas--vigente'}`}>
                            <td>{item.version}</td>
                            <td>{item.fechaVigencia}</td>
                            <td className='hidden md:table-cell'>{item.fechaAutorizacion}</td>
                            <td className='hidden md:table-cell'>{item.fechaActualizacion}</td>
                            <td className='hidden md:table-cell'>{item.fechaModificacion}</td>
                            <td className='hidden md:table-cell'>{item.fechaCarga}</td>
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
