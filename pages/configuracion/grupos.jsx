import React,{useEffect, useRef, useState} from 'react';
import { getBaseLayout } from '../../components/layout/BaseLayout';
import configuratorService from '../../services/configuratorService';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import Paginate from '../../components/paginate';
import GroupTable from '../../components/configuration/groups/GroupTable';
import useToggle from '../../hooks/useToggle';
import { FormModal } from '../../components/modals';
import GroupForm from '../../components/configuration/groups/GroupForm';
import {ConfirmModal} from '../../components/modals';
import witAuth from '../../components/withAuth';
import TabButton from '../../components/configuration/TabButton';

const Groups = (props) => {

    const service = configuratorService();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState({});
    const sendNotification = useNotification();
    const [showModal, setShowModal] = useToggle();
    const confirmModalRef = useRef(null);

    const handleSelect = item => setSelectedGroup(item);

    const handleAddButton = () => {
        if(selectedGroup) setSelectedGroup(undefined)
        setShowModal();
    }

    const addNewGroup = async values =>{
        try {
            await service.createGroup(values);
            const response = await service.getGroups();
            setGroups(response);
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message:'Error al crear grupo'
            });
        }
    }


    const updateGroup = async (idGroup, values) => {
        try {
            await service.updateGroup(idGroup, values);
            const response = await service.getGroups();
            setGroups(response);
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message:'Error al actualizar grupo'
            });
        }
    }

    const deleteGroup = async id =>{
        const confirm = await confirmModalRef.current.show();
        if(confirm){
            try {
                await service.deleteGroup(id);
                const response = await service.getGroups();
                setGroups(response);
                setSelectedGroup(undefined);
            } catch (error) {
                sendNotification({
                    type:'ERROR',
                    message:'Error al eliminar grupo'
                });
            }
        }
    }

    useEffect(()=>{
        (async()=>{
            try {
                const response = await service.getGroups();
                setGroups(response)
            } catch (error) {
                sendNotification({
                    type:'ERROR',
                    message:'Error al consultar grupos'
                });
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between h-fit p-4  bg-slate-50">
                <span className=" text-2xl font-semibold">Página de ventas</span>
                <span className=" text-3xl font-semibold">Configuración de Grupos</span>
            </div>
            <div className='p-4'>
                <TabButton/>
            </div>
            <section>
                <div className='p-4 md:p-8 space-y-4'>
                    <div className="flex justify-start">
                        <button className="primary-btn w-20" onClick={handleAddButton}>Agregar</button>
                    </div>
                    <Paginate
                        data={groups}
                        showItems={5}
                        options={{
                            labelSelector: "Mostrar",
                            optionRange: [20, 50, 100],
                            searchBy: ["Nombre"],
                        }}
                    >
                        <GroupTable 
                            handleSelect = {handleSelect}
                            handleShowModal = {setShowModal}
                            deleteGroup={deleteGroup}
                        />
                    </Paginate>
                </div>
            </section>

            {/*MODAS*/}
            <FormModal active={showModal} handleToggle={setShowModal} name={selectedGroup ? 'Editar grupo' : 'Agregar grupo'}>
                    <GroupForm 
                        item={selectedGroup}
                        addNewGroup = {addNewGroup}
                        updateGroup = {updateGroup}
                        handleToggle = {setShowModal}
                    />
            </FormModal>
            <ConfirmModal ref={confirmModalRef}/>
        </>
    )
}

const WithAuthGroups = witAuth(Groups);
WithAuthGroups.getLayout = getBaseLayout;
export default WithAuthGroups;
