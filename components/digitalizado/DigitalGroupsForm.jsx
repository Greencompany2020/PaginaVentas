import { Form, Formik } from 'formik';
import { TextInput, CheckBoxInput } from '../FormInputs';
import React from 'react';
import * as Yup from 'yup';


export default function DigitalGroupsForm({ item, createGroup, updateGroup, handleClose }) {


    const parseBol = value => {
        if (typeof value === 'boolean') {
            if (value) return 1;
            else return 0;
        }

        else if (typeof value === 'number') {
            if (value === 1) return true;
            else return false;
        }

        else return false;
    }

    const initialValues = {
        Nombre: item?.Nombre || '',
        isAdmin: parseBol(item?.isAdmin),
    }

    const validationSchema = Yup.object().shape({
        Nombre: Yup.string().required("Requerido"),
        isAdmin: Yup.bool()
    });

    const onSubmit = async (values, { resetForm }) => {
        let {Nombre, isAdmin} = values;
        isAdmin = parseBol(isAdmin);
        const body = {Nombre, isAdmin};
        if (item) {
            await updateGroup(body)
        }
        else {
            await createGroup(body)
        }
        resetForm({})
    }


    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize>
            <Form>
                <fieldset className="space-y-2">
                    <TextInput label={"Nombre"} name={"Nombre"} id={"Nombre"} />
                    <CheckBoxInput label={"Grupo administrador"} name={"isAdmin"} id={"isAdmin"} />
                </fieldset>
                <div className="mt-4 flex items-center justify-end space-x-2">
                    <input type={"reset"} value={"Cancelar"} className="secondary-btn w-32" onClick={handleClose} />
                    <input type={"submit"} value={"Guardar"} className="primary-btn w-32" />
                </div>
            </Form>
        </Formik>
    )
}
