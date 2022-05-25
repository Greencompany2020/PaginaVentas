import { useState, useRef } from 'react';
import Image from 'next/image';
import Verify from '../public/icons/ok-08.png';
import useAccess from '../hooks/useAccess';
import useToggle from '../hooks/useToggle';
import Groups, {GroupForm} from '../components/access/Groups';
import Users, {UserForm} from '../components/access/Users';
import TableAccess, {AccessForm} from '../components/access/TableAccess';
import {FormModal} from '../components/modals'
import Navbar from '../components/Navbar';
import { ConfirmModal } from '../components/modals';
import withAuth from '../components/withAuth';
import {useAlert} from '../context/alertContext';


const Accesos = () => {

    const alert = useAlert();
    const [showForm, setShowForm] = useState({
        target: '',
        action: ''
    });
    const [visible, toggleVisible] = useToggle(false);
    const {
        state, 
        handleSearch, 
        handleNext, 
        getUserAccess,
        createUser,
        createGroup,
        updateGroup,
        selectGroup,
        updateUser,
        deleteGroup,
        deleteUser,
        assignAccess,
        createAccess,
        selectAccess,
        updateAccess,
        handleNextUser,
        handleSearchUser,
        deleteAccess
    } = useAccess();

    const confirmModalRef = useRef(null);
    const ShowForm = () => {
        switch(showForm.target){
            case 'users':
                if(showForm.action == 'create'){
                    return <UserForm handleSubmit = {handleCreateUser} groups={state?.groups} toggleModal={toggleVisible}/>
                } 
                if(showForm.action == 'update') {
                    return <UserForm handleSubmit={handleUpdateUser} selectedUser = {state?.user?.data} groups={state?.groups}  toggleModal={toggleVisible}/>
                }
    
            case 'groups':
                if(showForm.action == 'create'){
                    return <GroupForm handleSubmit={handleCreateGroup}  toggleModal={toggleVisible}/>
                }
                if(showForm.action == 'update'){
                    return <GroupForm handleSubmit={handleUpdateGroup} selectedGroup = {state?.group}  toggleModal={toggleVisible}/>
                }
            case 'access':
                if(showForm.action == 'create'){ 
                    return <AccessForm handleSubmit={handleCreateAccess} toggleModal={toggleVisible}/>
                }
                if(showForm.action == 'update'){
                    return  <AccessForm handleSubmit={handleUpdateAccess} toggleModal={toggleVisible} selectedAccess={state.access.selected}/>
                }
            default:
                return <></>
        }

    }

    const handleModal = (target, action) =>{
       if(!visible){
           setShowForm({
               target,
               action,
           });
           toggleVisible();
       }
    }


    const handleCreateUser = async(id,body) => {
        const response = await createUser(body);
        const message = (response == true) ? 'Nuevo usuario creado' : 'No se pudo crear el usuario'
        const type = (response == true) ? 'info' : 'warning';
        alert.showAlert(message, type, 1000);
        toggleVisible();
    };

    const handleUpdateUser = async (id, body) => {
        const response = await updateUser(id, body)
        const message = (response == true) ? 'Usuario actualizado' : 'No se pudo actualizar el usuario'
        const type = (response == true) ? 'info' : 'warning';
        alert.showAlert(message, type, 1000);
        toggleVisible();
    }

    const handleDeleteUser = async (id) => {
        const confirm = await confirmModalRef.current.show();
        if(confirm){
            deleteUser(id);
        }
    }

    const handleCreateGroup = async (id,body) => {
        const response = await createGroup(body);
        const message = (response == true) ? 'Nuevo grupo creado' : 'No se pudo crear el grupo'
        const type = (response == true) ? 'info' : 'warning';
        alert.showAlert(message, type, 1000);
        toggleVisible();
    }

    const handleUpdateGroup = async (id, body) => {
        const response = await updateGroup(id, body);
        const message = (response == true) ? 'Grupo actualizado' : 'No se pudo actualizar el grupo'
        const type = (response == true) ? 'info' : 'warning';
        alert.showAlert(message, type, 1000);
        toggleVisible();
    }

    const handleDeleteGroup = async (id) => {
        const confirm = await confirmModalRef.current.show();
        if(confirm){
            deleteGroup(id);
        }
    }

    const handleAssign = async (id, current) => {
        const {success,message} = await assignAccess(id, current);
        if(!success){
            alert.showAlert(message, 'warning', 1000)
        }
    }

    const handleCreateAccess = async (body) => {
        const response = await createAccess(body);
        const message = (response == true) ? 'Acceso creado' : 'No se pudo crear el acceso'
        const type = (response == true) ? 'info' : 'warning';
        alert.showAlert(message, type, 1000);
        toggleVisible();
    }

    const handleUpdateAccess = async (body) => {
        const response = await updateAccess(body);
        const message = (response == true) ? 'Acceso actualizado' : 'No se pudo actualizar el acceso'
        const type = (response == true) ? 'info' : 'warning';
        alert.showAlert(message, type, 1000);
        toggleVisible();
    }

    const handleDeleteAccess = async (id) => {
        const confirm = await confirmModalRef.current.show();
        if(confirm){
            deleteAccess(id);
        }

    }

    return(
        <>
            <Navbar/>
            <section className="flex flex-col md:flex-row justify-between  mb-4 p-4">
                <span className=" text-2xl font-bold">Página de ventas</span>
                <span className=" text-3xl font-bold">Configuración de Accesos</span>
            </section>

            <section className="flex flex-col  p-4 space-y-8  md:flex-row md:space-x-8 md:space-y-0">
                <Groups groups={state?.groups} handleModal={handleModal} handleSelect={selectGroup} handleDelete ={handleDeleteGroup}/>
                <Users 
                    users={state?.users?.dataFilter} 
                    getUsers={getUserAccess} 
                    handleModal={handleModal} 
                    handleDelete={handleDeleteUser}
                    handleSearch={handleSearchUser}
                    pages={state?.users?.pages} 
                    current={state?.users?.current} 
                    next={handleNextUser}
                />
                
                <div className="flex-[4] flex flex-col  space-y-5">
                    <p className=" font-bold text-xl">Editando usuario: <span className=" text-blue-400 font-bold">{state?.user?.data?.UserCode}</span></p>
                    <div className="grid gap-4 md:grid-cols-6">

                        <div className='flex flex-col space-y-2 relative w-[150px] md:w-full'>
                            <label htmlFor="" className='text-md font-bold text-gray-600'>Empleado</label>
                            <figure className='relative'>
                            <input 
                                type="text"  
                                className='outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold w-full'
                                disabled
                                placeholder={state?.user?.data?.NoEmpleado}
                            />
                            <span className=' absolute top-1 right-0'>
                                <Image src={Verify} height={30} width={30} alt='OK'/>
                            </span>
                            </figure>
                        </div>

                        <div className='flex flex-col space-y-2 md:col-span-3'>
                            <label htmlFor=""  className='text-md font-bold text-gray-600'>Nombre</label>
                            <input 
                            type="text"  
                            className='outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold'
                            disabled
                            placeholder={state?.user?.data?.Nombre}
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor=""  className='text-md font-bold text-gray-600'>User Level</label>
                            <input 
                            type="text"  
                            className='outline-none border-2 h-10 rounded-md pl-3  placeholder:font-semibold'
                            disabled
                            placeholder={state?.user?.data?.Level}
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor=""  className='text-md font-bold text-gray-600'>Clase</label>
                            <input 
                            type="text"  
                            className='outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold'
                            disabled
                            placeholder={state?.user?.data?.Clase}
                            />
                        </div>
                    </div>

                    <TableAccess 
                        data={state?.access?.dataFilter} 
                        handleSearch={handleSearch}
                        pages={state?.access?.pages} 
                        current={state?.access?.current} 
                        next={handleNext}
                        handleAssign = {handleAssign}
                        handleModal={handleModal}
                        selectAccess = {selectAccess}
                        handleDelete = {handleDeleteAccess}
                    />
                </div>
            </section>

            <FormModal active={visible} handleToggle = {toggleVisible}>
                <ShowForm/>
            </FormModal>
            <ConfirmModal ref={confirmModalRef}/>
        </>
    )
}

export default withAuth(Accesos);
