import React, { useState, useEffect, useRef } from 'react';
import Avatar from '../../components/commons/Avatar';
import withAuth from '../../components/withAuth';
import Paginate from '../../components/paginate';
import digitalizadoService from '../../services/digitalizadoService';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import PoliticasTable from '../../components/digitalizado/PoliticasTable';
import PoliticasForm from '../../components/digitalizado/PoliticasForm';
import { FormModal } from '../../components/modals';
import useToggle from '../../hooks/useToggle';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import PoliticasDetails from '../../components/digitalizado/PoliticasDetails';
import PDFVisor from '../../components/digitalizado/PDFVisor';
import { getDigitalizadoLayout } from '../../components/layout/DigitalizadoLayout';
import { ConfirmModal } from '../../components/modals';
import ContainerUpdateForm from '../../components/digitalizado/ContainerUpdateForm';
import DrawerMenu from '../../components/commons/DrawerMenu';
import LoaderComponentBas from '../../components/LoaderComponentBas';
import { setAdmin } from '../../redux/reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const Digitalizado = () => {
    const { user } = useSelector(state => state);
    const [data, setData] = useState(null);
    const [userGroups, setUserGroups] = useState(null);
    const service = digitalizadoService();
    const sendNotification = useNotification();
    const [visibleForm, setVisibleForm] = useToggle();
    const [visibleDetail, setVisibleDetail] = useToggle();
    const [selectedItem, setSelectedItem] = useState(null);
    const [files, setFiles] = useState([]);
    const [visibleVisor, setVisibleVisor] = useToggle();
    const [various, setVarious] = useState([]);
    const [contents, setContents] = useState([]);
    const [itemUpdate, setItemUpdate] = useState(null)
    const confirModalRef = useRef(null);
    const confirFileRef = useRef(null);
    const [visibleContainerUpdate, setVisibleContainerUpdate] = useToggle();
    const [selectedContainer, setSelectedContainer] = useState(null);
    const [visbleAddLog, setVisibleAddLog] = useToggle();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const handleSelectedItem = async id => {
        setSelectedItem(id);
        setVisibleDetail();
    }


    const getInitialData = async () => {
        try {
            setIsLoading(true);
            const responseUserGroups = await service.getUserClave();
            setUserGroups(responseUserGroups);
            const responsePoliticas = await service.getPoliticas();
            setData(responsePoliticas);
            const res = (responseUserGroups?.isAdmin == 1) ? true : false;
            dispatch(setAdmin(res));
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            })
        }
        finally {
            setIsLoading(false);
        }
    }


    const handleAddNewPolitica = async body => {
        try {
            if (user?.isAdmin) {
                await service.addNewPolitica(body);
                await getInitialData();
                setVisibleForm();
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            })
        }
    }

    const handleOpenOne = async item => {
        try {
            const response = await service.getPoliticaFile(item);
            setFiles(response);
            setVisibleVisor();
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            })
        }
    }

    const handleOpenFew = async () => {
        try {
            if (various.length > 0) {
                const body = { files: various };
                const response = await service.getPoliticasList(body);
                setFiles(response);
                setVisibleVisor();
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            })
        }
    }

    const handleSetVarious = item => {
        const inList = various.find(el => el === item);
        if (!inList) setVarious(prev => ([...prev, item]));
        else setVarious(prev => (prev.filter(el => el != item)));
    }

    const handleSetContents = item => {
        const inList = contents.find(el => el === item);
        if (!inList) setContents(prev => ([...prev, item]));
        else setVarious(prev => (prev.filter(el => el != item)))
    }


    const handleDeleteVarious = async () => {
        try {
            if (user?.isAdmin) {
                if (contents.length > 0) {
                    const confirm = await confirModalRef.current.show();
                    if (confirm) {
                        const body = contents.toString();
                        await service.deletePoliticas(body);
                        await getInitialData();
                        setContents([]);
                        sendNotification({
                            type: 'OK',
                            message: 'Politica eliminada correctamente'
                        })
                    }
                }
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            })
        }
    }

    const handleSelectUpdate = item => {
        setItemUpdate(item);
        setVisibleForm();
    }

    const handleAddNew = () => {
        if (itemUpdate) setItemUpdate(null);
        setVisibleForm();
    }

    const handleUpdatecontainer = item => {
        setSelectedContainer(item);
        setVisibleContainerUpdate();
    }

    const handleAddLog = () => {
        setVisibleAddLog();
    }

    const handleUpdatePoliticaFile = async (id, body) => {
        try {
            if (user?.isAdmin) {
                const response = await service.updatePoliticaFile(id, body);
                await getInitialData();
                setVisibleForm();
                return response;
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            });
            return error;
        }
    }

    const handleUpdatePoliticaContainer = async (id, body) => {
        try {
            if (user?.isAdmin) {
                await service.updatePoliticaContainer(id, body);
                await getInitialData()
                setVisibleContainerUpdate();
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            });
        }
    }

    const handleAddNewLogToContainer = async (body) => {
        try {
            if (user?.isAdmin) {
                const response = await service.addPoliticaLog(body);
                await getInitialData();
                setVisibleAddLog();
                return response
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            });
            return error;
        }
    }

    const Claves = () => {
        if (!userGroups) return null;
        const items = userGroups?.claves.map(item => (item.claves));

        return <p className="truncate font-semibold">{items.toString().replaceAll(',', '/')}</p>
    }

    const handleDeleteFile = async id => {
        try {
            const confirm = await confirFileRef.current.show();
            if (confirm) {
                const response = await service.deletePoliticaFile(id);
                await getInitialData();
                return response;
            }
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.response?.message || error.message
            });
            return error;
        }
    }

    useEffect(() => {
        (async () => {
            try {
                await getInitialData();
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message: error?.response?.message || error.message
                })
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <>
            <div className="h-full flex flex-col md:flex-row">
                <section className=' hidden md:flex md:w-[300px] md:h-full bg-gray-200 '>
                    <div className='p-4'>
                        <div className="flex flex-col items-center md:justify-center space-y-2">
                            <figure className='w-[12rem] h-[12rem]'>
                                <Avatar image={user.ImgPerfil} />
                            </figure>
                        </div>
                        <div className='mt-8'>
                            <dl>
                                <dt className="font-semibold">Colaborador</dt>
                                <dd className="mb-2">{user.Nombre} {user.Apellidos}</dd>
                                <dt className="font-semibold">Usuario</dt>
                                <dd className="mb-2">{user.UserCode}</dd>
                                <dt className="font-semibold">Email</dt>
                                <dd className="mb-2">{user.Email}</dd>
                                <dt className="font-semibold">Grupo</dt>
                                <dd className='mb-2'>{ userGroups?.nombre}</dd>
                                <dt className="font-semibold">Claves autorizadas</dt>
                                <dd className="truncate ">
                                    <Claves />
                                </dd>
                            </dl>
                        </div>
                    </div>
                </section>

                <section className="w-full">
                    {
                        isLoading ?
                            <div className='w-full h-full overflow-auto'>
                                <div className='w-full h-full grid place-items-center'>
                                    <LoaderComponentBas isLoading={isLoading} />
                                </div>
                            </div>
                            :
                            <div className="p-4">
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-2">Politicas y procedimientos</h3>
                                    <p>
                                        Listado de politicas y procedimientos de The Green Company,
                                        disponibles para tu usuario, segun perfi. si no encuentras alguna
                                        politica o procedimiento favor de informar a DH
                                    </p>
                                </div>

                                {
                                    user?.isAdmin &&
                                    <div className="mb-4">
                                        <button onClick={handleAddNew} className='primary-btn w-28 flex items-center'>
                                            <PlusIcon width={24} className='mr-2' />
                                            Agregar
                                        </button>
                                    </div>
                                }

                                <div className="mb-4 flex flex-col  overflow-auto">
                                    <Paginate
                                        data={data?.politicas}
                                        showItems={5}
                                        options={{
                                            labelSelector: "Mostrar",
                                            optionRange: [20, 50, 100],
                                            searchBy: ["clave", "descripcion", "empresa"],
                                        }}
                                    >
                                        <PoliticasTable
                                            isAdmin={user?.isAdmin}
                                            handleSelectedItem={handleSelectedItem}
                                            handleSetVarious={handleSetVarious}
                                            handleSetContents={handleSetContents}
                                            handleUpdateContainer={handleUpdatecontainer}
                                        />
                                    </Paginate>
                                </div>

                                {
                                    user?.isAdmin &&
                                    <div className="flex justify-end mb-12 space-x-2">
                                        <button className="secondary-btn w-44" onClick={handleDeleteVarious}>Eliminar seleccion</button>
                                        <button className="primary-btn w-32 self-end" onClick={handleOpenFew}>Abrir seleccion</button>
                                    </div>
                                }
                            </div>
                    }
                </section>
            </div>


            {/* MODALES */}

            {/*
                Este modal de politias form es para agragar una nueva politica con contenedor
                y actualizar politicas seleccionadas
                decidi divivirlas por que los casos de uso no me permitian hacer todas los operaciones
                sobre el mismo modal
            */}
            <FormModal active={visibleForm} handleToggle={setVisibleForm} name={itemUpdate ? "Nuevas politicas" : "Editar politica"}>
                <PoliticasForm
                    handleAdd={handleAddNewPolitica}
                    item={itemUpdate}
                    handleUpdate={handleUpdatePoliticaFile}
                />
            </FormModal>


            {/*Este Modal muestra de forma detallada cada version de politica dentro del contenedor*/}
            <DrawerMenu expand={visibleDetail} handleExpand={setVisibleDetail}>
                <PoliticasDetails
                    isAdmin={user?.isAdmin}
                    item={selectedItem}
                    handleOpenOne={handleOpenOne}
                    handleUpdate={handleSelectUpdate}
                    handleAddLog={handleAddLog}
                    handleDelete={handleDeleteFile}
                />
            </DrawerMenu >

            {/*Visor pdf*/}
            <PDFVisor visible={visibleVisor} setVisible={setVisibleVisor} items={files} />


            {/*Modal de confimarcion*/}
            <ConfirmModal ref={confirModalRef} title="Eliminar Registros" message=" " >
                <div className="p-2 flex flex-col">
                    <TrashIcon width={32} className="self-end text-red-500" />
                    <p>
                        Esta accion eliminara los registros seleccionados
                        <span className="block">¿Deseas continuar?</span>
                    </p>
                </div>
            </ConfirmModal>


            {/*Modal para actualzar la descripcion del contenedor*/}
            <FormModal name={"Modificar descripcion"} active={visibleContainerUpdate} handleToggle={setVisibleContainerUpdate}>
                <ContainerUpdateForm item={selectedContainer} handleUpdate={handleUpdatePoliticaContainer} />
            </FormModal>


            {/*Modal para agregar nuevas politcas a un contenedor existente*/}
            <FormModal active={visbleAddLog} handleToggle={setVisibleAddLog} name="Nuevas politicas">
                <PoliticasForm
                    item={selectedItem}
                    handleAdd={handleAddNewLogToContainer}
                    opt={2}
                />
            </FormModal>


            {/*Modal para la eliminacion de archivos de politicas */}
            <ConfirmModal ref={confirFileRef} title="Eliminar Politica">
                <div className="p-2 flex flex-col">
                    <TrashIcon width={32} className="self-end text-red-500" />
                    <p>
                        Esta accion eliminara el siguiente archivo
                        <span className="block">¿Deseas continuar?</span>
                    </p>
                </div>
            </ConfirmModal>
        </>
    )
}


const DigitalizadoWithAuth = withAuth(Digitalizado);
DigitalizadoWithAuth.getLayout = getDigitalizadoLayout;
export default DigitalizadoWithAuth;
