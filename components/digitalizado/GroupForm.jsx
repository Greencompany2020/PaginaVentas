import React from 'react';
import { Formik, Form } from 'formik';
import { TextInput } from '../FormInputs';

export default function GroupForm({item, updateClave, createClave, handleClose}) {
    const initialValues = {
        claves: item?.claves || "",
        descripcion: item?.descripcion || "",
    }

    const handleOnSubmit = async (values,actions) => {
        if(item) await updateClave(item.id, values);
        else await createClave(values);
        actions.resetForm();
    }

    return (
        <Formik initialValues={initialValues} onSubmit={handleOnSubmit} enableReinitialize>
            <Form>
                <fieldset className="space-y-2">
                    <TextInput label="Clave" type="text" id="claves" name="claves" />
                    <TextInput label="Descripcion" type="text" id="descripcion" name="descripcion" />
                </fieldset>
                <div className="flex items-center justify-end space-x-2 mt-4">
                    <input type="reset" className="secondary-btn w-28" value="Cancelar" onClick={handleClose}/>
                    <input type="submit" className="primary-btn  w-28" value="Guardar"/>
                </div>
            </Form>
        </Formik>
    )
}
