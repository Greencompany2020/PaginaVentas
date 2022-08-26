import React from 'react';
import {Form, Formik} from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../FormInputs';

export default function GroupForm(props) {
    const {item, addNewGroup, updateGroup, handleToggle} = props; 
    const initialValues = {
        Id_proyect: item?.Id_proyect || 1,
        Nombre: item?.Nombre || ''
    }

    const validateSchema = Yup.object().shape({
        Id_proyect: Yup.number().required('Requerido'),
        Nombre: Yup.string().required("Requerido"),
    })

    const handleOnSubmit = async (values,{resetForm}) =>{
        if(item){
            await updateGroup(item.Id, values);
        }else{
            await addNewGroup(values);
        }
        resetForm({})
        handleToggle();
    }

    return(
        <Formik initialValues={initialValues} validationSchema={validateSchema} onSubmit={handleOnSubmit} enableReinitialize>
            <Form className='p-4'>
                <TextInput label='Nombre' type='text' name='Nombre'/>
                <div className="flex flex-row justify-end space-x-2 mt-6">
                    <input type='reset' value='Cancelar' className="secondary-btn w-28" onClick={handleToggle}/>
                    <input type='submit' value='Guardar' className="primary-btn w-28"/>
                </div>
            </Form>
        </Formik>
    )
}
