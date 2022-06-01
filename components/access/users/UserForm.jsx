import React from 'react';
import {Form, Formik, Field} from 'formik';
import * as Yup from 'yup';

export default function UserForm(props) {
    const {groups, item, handleSubmit,toggleVisible} = props;
    
    const initialValues = {
        UserCode:  item?.UserCode || '',
        Email:  item?.Email || '',
        NoEmpleado:  item?.NoEmpleado || '',
        Level:  item?.Level || 1,
        Clase:  item?.Clase || 1,
        Nombre:  item?.Nombre || '',
        Apellidos:  item?.Apellidos || '',
        password: '',
        idGrupo:  item?.IdGrupo || 0,
    }

    const validationSchema = Yup.object().shape({
        UserCode: Yup.string().required('Requerido'),
        Email: Yup.string().email('Ingrese un email con formato valido @example.com').required('Requerido'),
        NoEmpleado: Yup.number().transform(v => (parseInt(v))).required('Requerido'),
        Level: Yup.number().transform(v => (parseInt(v))),
        Clase: Yup.number().transform(v =>(parseInt(v))),
        Nombre: Yup.string().required('Requerido'),
        Apellidos: Yup.string().required('Requrido'),
        idGrupo: Yup.number().transform(v => (parseInt(v))),
        password: (!item) && Yup.string().required('Requerido')
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
                onSubmit={(values) =>  {
                    if(!item){
                        handleSubmit( values);
                        toggleVisible();
                    }else{
                        handleSubmit( item.Id, values);
                        toggleVisible();
                    }
                }}
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
                                    type='number' 
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
                            {
                                (! item) &&
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
                            }
                            <div className='flex flex-row space-x-4'> 
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="Clase" className='font-semibold  text-gray-600'>Clase</label>
                                    <Field component='select' id='Clase' name='Clase' className='h-8 border rounded-md border-slate-400 w-20'>
                                        <option number={0}>0</option>
                                        <option number={1}>1</option>
                                    </Field>
                                    {errors?.Clase && touched?.Clase ? <span className='font-semibold text-red-500'>{errors?.Clase}</span> : null}
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="Level" className='font-semibold  text-gray-600'>Level</label>
                                    <Field as='select' id='Level' name = 'Level' className='h-8 border rounded-md border-slate-400 w-20'>
                                        <option value={3}>3</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={10}>10</option>
                                        <option value={11}>11</option>
                                        <option value={20}>20</option>
                                    </Field>
                                    {errors?.Level&& touched?.Level? <span className='font-semibold text-red-500'>{errors?.Level}</span> : null}
                                </div>
                                <div className='flex flex-col space-y-1'>
                                    <label htmlFor="idGrupo" className='font-semibold  text-gray-600'>Grupo</label>
                                    <Field as='select' id='idGrupo' name = 'idGrupo' className='h-8 border rounded-md border-slate-400 w-44'>
                                        <ListGroups/>
                                    </Field>
                                    {errors?.idGrupo&& touched?.idGrupo? <span className='font-semibold text-red-500'>{errors?.idGrupo}</span> : null}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end mt-8'>
                            <button
                                type='reset'
                                value='reset'
                                className='secondary-btn w-28 mr-2'
                                onClick={toggleVisible}
                            >
                             Cancelar</button>

                            <button
                                type='submit'
                                value='submit'
                                className='primary-btn w-28' 
                            >
                            Guardar</button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}