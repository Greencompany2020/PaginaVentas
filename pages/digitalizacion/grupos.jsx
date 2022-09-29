import React, { useState, useEffect, useRef } from 'react';
import withAuth from '../../components/withAuth';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
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
import { ConfirmModal } from '../../components/modals';
import { setAdmin } from '../../redux/reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import configuratorService from '../../services/configuratorService';
import DigitalGroupsTable from '../../components/digitalizado/DigitalGroupsTable';
import DigitalGroupsForm from '../../components/digitalizado/DigitalGroupsForm';

export const DigiGropus = () => {
    const { user } = useSelector(state => state);
    const [claves, setClaves] = useState(null);
    const service = digitalizadoService();
    const configurator = configuratorService();
    const sendNotification = useNotification();
    const [visibleForm, setVisibleForm] = useToggle();
    const [visibleGroup, setVisibleGroup] = useToggle();
    const [selected, setSelected] = useState(null);
    const confirModalRef = useRef(null);
    const dispatch = useDispatch();
    const router = useRouter();
    const [opc, setOpc] = useState(1);

    const [groups, setGroups] = useState(null);
    const [visibleGroupsForm, setVisibleGroupsForm] = useToggle();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const confirmModalGroup = useRef(null);

    const getGroups = async () => {
        try {
            const response = await service.getClaves();
            const responseUserGroups = await service.getUserClave();
            setClaves(response);
            const res = (responseUserGroups?.isAdmin == 1) ? true : false;
            dispatch(setAdmin(res));
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message:error.response?.data?.message,
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
                message: error.response?.data?.message,
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
                message:error.response?.data?.message,
            })
        }
    }

    const handleDeleteClave = async id => {
        try {
            const confirm = await confirModalRef.current.show();
            if (confirm) {
                await service.deleteClave(id);
                await getGroups();
                sendNotification({
                    type:"OK",
                    message:"Clave eliminada correctamente"
                })
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message:error.response?.data?.message,
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




    const getDigitalGropus = async () => {
        try {
            const response = await configurator.getGruposDigitalizacion();
            setGroups(response);
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message:error.response?.data?.message,
            })
        }
    }

    const addNewDigitalGroup = async body => {
        try {
            await configurator.createDigitalizacionGrupo(body);
            await getDigitalGropus();
            setVisibleGroupsForm();
            sendNotification({
                type:"OK",
                message: "Rol creado"
            })
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message:error.response?.data?.message,
            })
        }
    }

    const updateDigitalGroup = async body => {
        try {
            await configurator.updateDigitalizacionGrupo(selectedGroup?.Id, body);
            await getDigitalGropus();
            setVisibleGroupsForm();
            sendNotification({
                type:"OK",
                message: "Rol modificado"
            })
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message:error.response?.data?.message,
            });
        }
    }

    const deleteDigitalGroup = async id => {
        const confirm = await confirmModalGroup.current.show();
        if (confirm) {
            try {
                await configurator.deleteDigitalizacionGrupo(id);
                await getDigitalGropus();
                sendNotification({
                    type:"OK",
                    message: "Rol eliminado correctamente"
                })
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message:error.response?.data?.message,
                })
            }
        }
    }

    const handleAddGroup = () => {
        if (selectedGroup) setSelectedGroup(null);
        setVisibleGroupsForm();
    }

    const handleUpdateGroup = item => {
        setSelectedGroup(item);
        setVisibleGroupsForm();
    }

    useEffect(() => {
        (async () => {
            await getGroups();
            await getDigitalGropus();
        })()
    }, []);


    return (
        <>
            <section className="w-full">
                <div className='p-4'>

                    <div className="flex flex-col mb-8 space-y-4">
                        <div className="flex items-center">
                            <UserGroupIcon width={36} className="mr-2" />
                            <h3 className="text-xl font-bold">Claves y permisos por grupo</h3>
                        </div>

                        <div className="flex flex-row space-x-2">
                            <button className="secondary-btn w-48" onClick={() => setOpc(1)}>
                                <span>Claves de digitalizacion</span>
                            </button>
                            <button className="secondary-btn w-48" onClick={() => setOpc(2)}>
                                <span>Roles de digitalizacion</span>
                            </button>
                        </div>
                    </div>

                    {
                        (opc == 1) ?
                            <>
                                <div className="mb-8">
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
                                        <ClavesTable handleEdit={handleEdit} editGroups={handleEditGroups} deleteClave={handleDeleteClave} />
                                    </Paginate>
                                </div>
                            </>
                            :
                            <>
                                <div className="mb-8">
                                    <button className='primary-btn w-28 flex items-center' onClick={handleAddGroup}>
                                        <PlusIcon width={24} className='mr-2' />
                                        Agregar
                                    </button>
                                </div>

                                <div className="flex flex-col">
                                    <Paginate
                                        data={groups}
                                        showItems={5}
                                        options={{
                                            labelSelector: "Mostrar",
                                            optionRange: [20, 50, 100],
                                            searchBy: ["Nombre"],
                                        }}
                                    >
                                        <DigitalGroupsTable handleEdit={handleUpdateGroup} handleDelete={deleteDigitalGroup} />
                                    </Paginate>
                                </div>
                            </>
                    }

                </div>
            </section>

            {/*MODALES PARA CLAVES DE POLITICAS*/}
            <FormModal
                active={visibleForm}
                handleToggle={setVisibleForm}
                name={selected ? "Edidar clave para documentos" : "Crear clave para documentos"}
            >
                <GroupForm
                    item={selected}
                    updateClave={handleUpdateClave}
                    createClave={handleCreateClave}
                    handleClose={setVisibleForm}
                />
            </FormModal>

            <FormModal active={visibleGroup} handleToggle={setVisibleGroup} name={`Asignacion de grupos a clave ${selected?.claves}`}>
                <ClaveGroups id={selected?.id} handleToggle={setVisibleGroup} />
            </FormModal>

            <ConfirmModal ref={confirModalRef} title="Eliminar clave">
                <div className="p-2 flex flex-col">
                    <TrashIcon width={32} className="self-end text-red-500" />
                    <p>
                        Esta accion eliminara la siguiente clave de politicas
                        <span className="block">¿Deseas continuar?</span>
                    </p>
                </div>
            </ConfirmModal>

            {/*MODALES PARA USUARIOS*/}
            <FormModal
                active={visibleGroupsForm}
                handleToggle={setVisibleGroupsForm}
                name={selectedGroup ? "Editar grupo" : "Agregar grupo"}
            >
                <DigitalGroupsForm
                    item={selectedGroup}
                    createGroup={addNewDigitalGroup}
                    updateGroup={updateDigitalGroup}
                    handleClose={setVisibleGroupsForm}
                />
            </FormModal>

            <ConfirmModal ref={confirmModalGroup} title="Eliminar rol">
            <div className="p-2 flex flex-col">
                    <TrashIcon width={32} className="self-end text-red-500" />
                    <p>
                        Esta accion eliminara el siguiente rol
                        <span className="block">¿Deseas continuar?</span>
                    </p>
                </div>
            </ConfirmModal>
        </>
    )
};

const DigiGropusWithAuth = withAuth(DigiGropus);
DigiGropusWithAuth.getLayout = getDigitalizadoLayout;
export default DigiGropusWithAuth;