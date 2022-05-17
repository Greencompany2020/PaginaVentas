import { useState } from 'react';
import Image from 'next/image';
import Verify from '../public/icons/ok-08.png';
import useAccess from '../hooks/useAccess';
import useToggle from '../hooks/useToggle';
import Groups, {GroupForm} from '../components/access/Groups';
import Users, {UserForm} from '../components/access/Users';
import TableAccess from '../components/access/TableAccess';
import {FormModal} from '../components/modals'


const Accesos = () => {

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
        updateUserAccess,
        createUser
    } = useAccess();

    const ShowForm = () => {
        switch(showForm.target){
            case 'users':
                if(showForm.action == 'create') return <UserForm handleSubmit = {handleCreateUser} groups={state?.groups}/>
                if(showForm.action == 'update') return <UserForm selectedUser = {state?.user?.data} groups={state?.groups}/>
    
            case 'groups':
                if(showForm.action == 'create') return <GroupForm/>
                if(showForm.action == 'update') return <GroupForm/>
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

    const handleCreateUser = (body) => createUser(body);

    return(
        <>
            <section className="flex flex-col md:flex-row justify-between  mb-4 p-4">
                <span className=" text-2xl font-bold">Página de ventas</span>
                <span className=" text-3xl font-bold">Configuración de Accesos</span>
            </section>

            <section className="flex flex-col  p-4 space-y-8  md:flex-row md:space-x-8 md:space-y-0">
                <Groups groups={state?.groups} handleModal={handleModal}/>
                <Users users={state?.users} getUsers={getUserAccess} handleModal={handleModal}/>
                
                <div className="flex-[4] flex flex-col  space-y-5">
                    <p className=" font-bold text-xl">Editando usuario: <span className=" text-blue-400 font-bold">{state?.user?.UserCode}</span></p>
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
                        updateUserAccess = {updateUserAccess}
                    />
                </div>
            </section>

            <FormModal active={visible} handleToggle = {toggleVisible}>
                <ShowForm/>
            </FormModal>
            
        </>
    )
}

export default Accesos;