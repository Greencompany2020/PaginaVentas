import React, { useState, useEffect } from 'react';
import withAuth from '../../components/withAuth';
import {  PlusIcon} from '@heroicons/react/outline';
import { UserGroupIcon } from '@heroicons/react/solid'
import Paginate from '../../components/paginate';
import digitalizadoService from '../../services/digitalizadoService';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import ClavesTable from '../../components/digitalizado/ClavesTable';
import { FormModal } from '../../components/modals';
import useToggle from '../../hooks/useToggle';
import GroupForm from '../../components/digitalizado/GroupForm';
import ClaveGroups from '../../components/digitalizado/ClaveGroups';
import { getDigitalizadoLayout } from '../../components/layout/DigitalizadoLayout';

export const DigiGropus = () => {
    const [claves, setClaves] = useState(null);
    const service = digitalizadoService();
    const sendNotification = useNotification();
    const [visibleForm, setVisibleForm] = useToggle();
    const [visibleGroup, setVisibleGroup] = useToggle();
    const [selected, setSelected] = useState(null);

    const getGroups = async () => {
        try {
            const response = await service.getClaves();
            setClaves(response);
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message,
            });
        }
    }

    const handleCreateClave = async body => {
        try {
            await service.createClave(body);
            await getGroups();
            setVisibleForm();
            sendNotification({
                type: 'OK',
                message: 'Clave creada',
            });
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message,
            });
        }
    }

    const handleUpdateClave = async (id, body) => {
        try {
            await service.updateClave(id, body);
            await getGroups();
            setVisibleForm();
            setSelected(null);
            sendNotification({
                type: 'OK',
                message: 'Clave modificada',
            });
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message,
            })
        }
    }

    const handleEdit = item => {
        setSelected(item);
        setVisibleForm();
    }

    const handleCreate = () => {
        if (selected) setSelected(null);
        setVisibleForm();
    }

    const handleEditGroups = item => {
        setSelected(item);
        setVisibleGroup();
    }

    useEffect(() => {
        (async () => {
            await getGroups();
        })()
    }, []);


    return (
        <>
            <section className="w-full">
                <div className='p-4'>
                    <div className="flex items-center mb-8">
                        <UserGroupIcon width={36} className="mr-2" />
                        <h3 className="text-xl font-bold">Claves y permisos por grupo</h3>
                    </div>
                    <div className="mb-4">
                        <button className='primary-btn w-28 flex items-center' onClick={handleCreate}>
                            <PlusIcon width={24} className='mr-2' />
                            Agregar
                        </button>
                    </div>
                    <div className="flex flex-col">
                        <Paginate
                            data={claves}
                            showItems={5}
                            options={{
                                labelSelector: "Mostrar",
                                optionRange: [20, 50, 100],
                                searchBy: ["claves", "descripcion"],
                            }}
                        >
                            <ClavesTable handleEdit={handleEdit} editGroups={handleEditGroups} />
                        </Paginate>
                    </div>
                </div>
            </section>

             {/*MODALES*/}
             <FormModal 
                active={visibleForm} 
                handleToggle={setVisibleForm} 
                name={selected ? "Edidar clave para documentos" : "Crear clave para documentos"}
            >
                <GroupForm
                    item={selected}
                    updateClave={handleUpdateClave}
                    createClave={handleCreateClave}
                />
            </FormModal>

            <FormModal active={visibleGroup} handleToggle={setVisibleGroup} name={`Asignacion de grupos a clave ${selected?.claves}`}>
                <ClaveGroups id={selected?.id} handleToggle={setVisibleGroup} />
            </FormModal>
        </>
    )
};

const DigiGropusWithAuth = withAuth(DigiGropus);
DigiGropusWithAuth.getLayout = getDigitalizadoLayout;
export default DigiGropusWithAuth;