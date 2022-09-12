import React from 'react';
import { Formik, Form } from 'formik';
import { SelectInput, TextInput } from '../FormInputs';


export default function PoliticasForm() {

    const initialData = {

    }
    return (
        <Formik>
            <Form>
                <TextInput label={"clave"} />
            </Form>
        </Formik>
    )
}
