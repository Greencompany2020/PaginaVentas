import {Form, Formik, Field} from 'formik'
import {PlusCircleIcon, PencilAltIcon, TrashIcon} from '@heroicons/react/outline';
import * as Yup from 'yup';


const UserList = ({items ,handleOnclick, handleModal}) => {
    if(!items) return <></>
    const itemsList = items.map((item, index) => (
            <li 
                key={index} className="flex w-full justify-between hover:bg-slate-200 rounded-md p-1 cursor-pointer"
                onClick={()=>handleOnclick(item?.Id)}
            >
                <span>{item.UserCode}</span>
                <div className='flex'>
                    <PencilAltIcon width={26} onClick={() => handleModal('users', 'update')}/>
                    <TrashIcon width={26}/>
                </div>
            </li>
    ));
    return itemsList;
}


export const UserForm = ({groups, selectedUser, handleSubmit}) => {

    const initialValues = {
        UserCode: selectedUser?.UserCode || '',
        Email: selectedUser?.Email || '',
        NoEmpleado: selectedUser?.NoEmpleado || '',
        Level: selectedUser?.Level || 1,
        Clase: selectedUser?.Clase || 1,
        Nombre: selectedUser?.Nombre || '',
        Apellidos: selectedUser?.Apellidos || '',
        password: '',
    }

    const validationSchema = Yup.object().shape({
        UserCode: Yup.number().transform(v => (parseInt(v))).required('Requerido'),
        Email: Yup.string().email('Ingrese un email con formato valido @example.com').required('Requerido'),
        NoEmpleado: Yup.number().required('Requerido'),
        Level: Yup.number().transform(v => (parseInt(v))),
        Clase: Yup.number().transform(v =>(parseInt(v))),
        Nombre: Yup.string().required('Requerido'),
        Apellidos: Yup.string().required('Requrido'),
        password: Yup.string()
    })

    const ListGroups = () =>{
        if(!groups) return <option value={0}>Sin grupo</option>
        const items = groups.map((item, index)=>(
            <option key={index} value={item.Id}>
                {item.Nombre}
            </option>
        ));
        return items;
    }

    return(
        <div className='p-4'>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({errors, touched}) => (
                    <Form>
                        <div className='space-y-2'>
                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="Nombre" className='font-semibold  text-gray-600'>Nombre</label>
                                <Field 
                                    type='text' 
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    id='Nombre'
                                    name='Nombre'
                                />
                                {errors?.Nombre && touched?.Nombre ? <span className='font-semibold text-red-500'>{errors?.Nombre}</span> : null}
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="Apellidos" className='font-semibold  text-gray-600'>Apellidos</label>
                                <Field 
                                    type='text' 
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    id='Apellidos'
                                    name='Apellidos'
                                />
                                {errors?.Apellidos && touched?.Apellidos ? <span className='font-semibold text-red-500'>{errors?.Apellidos}</span> : null}
                            </div>
                        </div>

                        <div className='mt-6 space-y-2'>
                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="NoEmplead" className='font-semibold  text-gray-600'>No. Empleado</label>
                                <Field 
                                    type='text' 
                                    className='h-10 border rounded-md border-slate-400 w-44 pl-2'
                                    id='NoEmpleado'
                                    name = 'NoEmpleado'
                                />
                                {errors?.NoEmpleado && touched?.NoEmpleado ? <span className='font-semibold text-red-500'>{errors?.NoEmpleado}</span> : null}
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="UserCode" className='font-semibold text-gray-600'>Usuario</label>
                                <Field 
                                    type='text' 
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    id='UserCode'
                                    name='UserCode'
                                />
                                {errors?.UserCode && touched?.UserCode ? <span className='font-semibold text-red-500'>{errors?.UserCode}</span> : null}
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="Email" className='font-semibold  text-gray-600'>Email</label>
                                <Field 
                                    type='text' 
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    id='Email'
                                    name='Email'
                                />
                                {errors?.Email && touched?.Email ? <span className='font-semibold text-red-500'>{errors?.Email}</span> : null}
                            </div>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="Email" className='font-semibold  text-gray-600'>Password</label>
                                <Field 
                                    type='password' 
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    id='password'
                                    name='password'
                                />
                                {errors?.password && touched?.password ? <span className='font-semibold text-red-500'>{errors?.password}</span> : null}
                            </div>

                            <div className='flex flex-row space-x-4'> 
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="Clase" className='font-semibold  text-gray-600'>Clase</label>
                                    <Field component='select' id='Clase' name='Clase' className='h-8 border rounded-md border-slate-400 w-20'>
                                        <option number={1}>1</option>
                                        <option number={2}>2</option>
                                    </Field>
                                    {errors?.Clase && touched?.Clase ? <span className='font-semibold text-red-500'>{errors?.Clase}</span> : null}
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="Level" className='font-semibold  text-gray-600'>Level</label>
                                    <Field as='select' id='Level' name = 'Level' className='h-8 border rounded-md border-slate-400 w-20'>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                    </Field>
                                    {errors?.Level&& touched?.Level? <span className='font-semibold text-red-500'>{errors?.Level}</span> : null}
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="Grupo" className='font-semibold  text-gray-600'>Grupo</label>
                                    <Field as='select' id='Grupo' name = 'Grupo' className='h-8 border rounded-md border-slate-400 w-44'>
                                        <ListGroups/>
                                    </Field>
                                    {errors?.Grupo&& touched?.Grupo? <span className='font-semibold text-red-500'>{errors?.Grupo}</span> : null}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end mt-8'>
                            <button
                               type='submit'
                               value='submit'
                                className=' bg-cyan-500 w-28 h-10 text-white p-1 rounded-md place-self-end font-bold' 
                            >
                            Guardar</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}



const Users = ({users, getUsers, handleModal}) => {
    return(
        <div  className="flex-[1] ">
            <div className="flex  items-start space-x-1">
                <div className="flex-1">
                    <span className=" block font-bold text-md bg-slate-300 rounded-md p-1 mb-1">Usuarios</span>
                    <input
                        className=" bg-yellow-100 w-full rounded-md border-2 h-8"
                    />
                    <ul className="space-y-2 mt-3">
                        <UserList items={users} handleOnclick={getUsers} handleModal={handleModal}/>
                    </ul>
                </div>
                <PlusCircleIcon width={32} className="block cursor-pointer" onClick={()=>handleModal('users', 'create')}/>
            </div>
        </div>
    )
}

export default Users;