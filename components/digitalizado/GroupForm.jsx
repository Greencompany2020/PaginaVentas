import React from 'react';
import { Formik, Form } from 'formik';
import { TextInput, CheckBoxInput } from '../FormInputs';
import * as Yup from 'yup'

export default function GroupForm({ item, updateClave, createClave, handleClose }) {

    const isBool = value => {
        if(value && value == 1) return true;
        return false;
    }

    const toNum = value => {
        if(value && value == true) return 1;
        return 0;
    }

    const initialValues = {
        claves: item?.claves || "",
        descripcion: item?.descripcion || "",
        mostrarHistoria:isBool(item?.mostrarHistoria),
    }

    const validationSchema = Yup.object().shape({
        claves: Yup.string().required('Requerido'),
        descripcion: Yup.string().required('Requerido'),
        mostrarHistoria: Yup.boolean()
    })

    const handleOnSubmit = async (values, actions) => {
        const body = {
            claves: values.claves, 
            descripcion: values.descripcion, 
            mostrarHistoria: toNum(values.mostrarHistoria)
        }
        if (item) await updateClave(item.id, body);
        else await createClave(body);
        actions.resetForm();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleOnSubmit} validationSchema={validationSchema} enableReinitialize>
            <Form>
                <fieldset className="space-y-2">
                    <TextInput label="Clave" type="text" id="claves" name="claves" />
                    <TextInput label="Descripcion" type="text" id="descripcion" name="descripcion" />
                    <CheckBoxInput label="Mostrar historial" id="mostrarHistoria" name="mostrarHistoria" />
                </fieldset>
                <div className="flex items-center justify-end space-x-2 mt-4">
                    <input type="reset" className="secondary-btn w-28" value="Cancelar" onClick={handleClose} />
                    <input type="submit" className="primary-btn  w-28" value="Guardar" />
                </div>
            </Form>
        </Formik>
    )
}
