import React from 'react';
import {Form, Formik, Field} from 'formik'
import * as Yup from 'yup'

export default function GroupForm(props) {

    const {handleSubmit, item, toggleVisible} = props;
    
    const initialValues = {
        Id_proyect: item?.Id_proyect || 1,
        Nombre: item?.Nombre || ''
    }

    const validateSchema = Yup.object().shape({
        Id_proyect: Yup.number().required('Requerido'),
        Nombre: Yup.string().required("Requerido"),
    })
    return(
        <div className='p-4'>
            <Formik
                initialValues={initialValues}
                validationSchema={validateSchema}
                onSubmit={(values) => {
                    if(!item) {
                        handleSubmit(values)
                    }
                    else{
                        handleSubmit(item?.Id,values)
                    }
                }}
            >
                {({errors, touched}) => (
                    <Form>
                        <div className='space-y-2 flex flex-col'>
                            <label htmlFor="Nombre">Nombre</label>
                            <Field 
                                type='text' 
                                name='Nombre'
                                id='Nombre'
                                className='h-10 border rounded-md border-slate-400 pl-2'
                                placeholder = 'ej. Administradores'
                            />
                            {errors?.Nombre && touched?.Nombre ? <span className='font-semibold text-red-500'>{errors?.Nombre}</span> : null}
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
