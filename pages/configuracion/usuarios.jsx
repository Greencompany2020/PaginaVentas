import React, { useEffect, useState, useRef } from 'react';
import UserInfo from '../../components/configuration/users/UserInfo';
import configuratorService from '../../services/configuratorService';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import Paginate from '../../components/paginate';
import UserTable from '../../components/configuration/users/UserTable';
import { FormModal } from '../../components/modals';
import UserForm from '../../components/configuration/users/UserForm';
import { getBaseLayout } from '../../components/layout/BaseLayout';
import useToggle from '../../hooks/useToggle';
import UserAccessTable from '../../components/configuration/users/UserAccessTable';
import { ConfirmModal } from '../../components/modals/';
import witAuth from '../../components/withAuth';
import TabButton from '../../components/configuration/TabButton';

const Users = (props) => {
    const service = configuratorService();
    const sendNotification = useNotification();
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [userDetails, setUserDetail] = useState({});
    const [showModal, setShowModal] = useToggle();
    const [showRetrieve, setShowRetrieve] = useToggle();
    const confirmModalRef = useRef(null);
    const [digitalGroups, setDigitalGroups] = useState([]);

    const handleSelect = async item => {
        setSelectedUser(item);
        try {
            const response = await service.getUserDetail(item.Id);
            setUserDetail(response)
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error.response.data.message || error.message
            })
        }
    }

    const handleAddButton = () => {
        if (selectedUser) setSelectedUser(undefined)
        setShowModal();
    }

    const addNewUser = async values => {
        try {
            await service.createUser(values);
            const response = await service.getUsers();
            setUsers(response);
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error.response.data.message || error.message
            })
        }
    }

    const updateUser = async (id, values) => {
        try {
            await service.updateUser(id, values);
            const response = await service.getUsers();
            setUsers(response);
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error.response.data.message || error.message
            })
        }
    }

    const deleteUser = async id => {
        const confirm = await confirmModalRef.current.show();
        if (confirm) {
            try {
                await service.deleteUser(id);
                const response = await service.getUsers();
                setUsers(response);
                setUserDetail(undefined);
                setSelectedUser(undefined);
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message: error.response.data.message || error.message
                })
            }
        }
    }

    const assignAccessToUser = async item => {
        if (selectedUser && item) {
            try {
                const idUser = selectedUser.Id;
                const enabled = item.acceso ? 'N' : 'Y';
                const idDashboard = item.idDashboard;
                const body = { idDashboard, idUser, enabled };
                await service.assignAccess(body);
                const response = await service.getUserDetail(selectedUser.Id);
                setUserDetail(response);
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message: error.response.data.message || error.message
                });
            }
        }
    }

    const adduserToDigitalGroup = async body => {
        try {
            await service.setUserToGrupoDigitalizacion(body);
            const response = await service.getUsers();
            setUsers(response);
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error.response.data.message || error.message
            });
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const userResponse = await service.getUsers();
                const groupResponse = await service.getGroups();
                const digitalGroupsResponse = await service.getGruposDigitalizacion();
                setUsers(userResponse);
                setGroups(groupResponse);
                setDigitalGroups(digitalGroupsResponse)
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message: error.response.data.message || error.message
                });
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between h-fit p-4  bg-slate-50">
                <span className=" text-2xl font-semibold">Página de ventas</span>
                <span className=" text-3xl font-semibold">Configuración de Usuarios</span>
            </div>

            <div className='p-4'>
                <TabButton />
            </div>

            <section>
                <div className='p-4 md:p-8' >
                    <UserInfo item={selectedUser} />
                </div>
                <div className='p-4 md:p-8 space-y-4'>
                    <div className="flex justify-start">
                        <button className="primary-btn w-20" onClick={handleAddButton}>Agregar</button>
                    </div>
                    <Paginate
                        data={users}
                        showItems={5}
                        options={{
                            labelSelector: "Mostrar",
                            optionRange: [20, 50, 100],
                            searchBy: ["Nombre", "UserCode", "NoEmpleado"],
                        }}>
                        <UserTable
                            handleSelect={handleSelect}
                            handleShowModal={setShowModal}
                            handleShowAccess={setShowRetrieve}
                            deleteUser={deleteUser}
                        />
                    </Paginate>
                </div>
            </section>

            {/* MODALS */}
            <FormModal key={1} active={showModal} handleToggle={setShowModal} name={userDetails ? 'Editar usuario' : 'Agregar usuario'}>
                <UserForm
                    item={userDetails?.usuario}
                    groups={groups}
                    addNewUser={addNewUser}
                    updateUser={updateUser}
                    handleToggle={setShowModal}
                    digitalGroups={digitalGroups}
                    addUserToGroup={adduserToDigitalGroup}
                />
            </FormModal>

            <FormModal key={2} active={showRetrieve} handleToggle={setShowRetrieve} name='Asignar acceso'>
                <div className=" p-8  h-[500px] w-[400px] md:h-[570px] md:w-[500px] lg:w-[1000px] overflow-y-auto">
                    <Paginate
                        data={userDetails?.accesos}
                        showItems={5}
                        options={{
                            labelSelector: "Mostrar",
                            optionRange: [20, 50, 100],
                            searchBy: ["menu", "reporte", "nombreReporte"],
                        }}
                    >
                        <UserAccessTable assignAccessToUser={assignAccessToUser} />
                    </Paginate>
                </div>
            </FormModal>
            <ConfirmModal ref={confirmModalRef} title='Eliminar usuario' message={`Eliminar al usuario usuario ${selectedUser?.Nombre}`} />
        </>
    )
}

const WithAuthUsers = witAuth(Users);
WithAuthUsers.getLayout = getBaseLayout;
export default WithAuthUsers
