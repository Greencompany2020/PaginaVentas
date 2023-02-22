import React from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../FormInputs';


export default function Proyectform(props) {
    const { item, handleToggle, onCreateNew, onUpdate } = props;

    const initialValues = {
        Nombre: item?.Nombre || ''
    }

    const validateSchema = Yup.object().shape({
        Nombre: Yup.string().required("Requerido"),
    })

    const handleOnSubmit = async (values, { resetForm }) => {
        if(item){
            await onUpdate(values);
        }else{
            await onCreateNew(values);
        }
        resetForm({});
        handleToggle();
    }

    return (
        <Formik initialValues={initialValues} validationSchema={validateSchema} onSubmit={handleOnSubmit} enableReinitialize>
            <Form className='p-4'>
                <TextInput label='Nombre' type='text' name='Nombre' />
                <div className="flex flex-row justify-end space-x-2 mt-6">
                    <input type='reset' value='Cancelar' className="secondary-btn w-28" onClick={handleToggle} />
                    <input type='submit' value='Guardar' className="primary-btn w-28" />
                </div>
            </Form>
        </Formik>
    )
}