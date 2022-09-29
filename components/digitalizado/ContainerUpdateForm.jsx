import React from 'react';
import {Form, Formik} from 'formik';
import {TextAreaInput} from "../FormInputs";
import * as Yup from 'yup';

export default  function ContainerUpdateForm({item, handleUpdate, handleClose}){

  const validationSchema = Yup.object().shape({
    descripcion: Yup.string().required("Requerido"),
  })

  const initialValues = {
    descripcion: item?.descripcion || ''
  }

  const handleOnsubmit = async (values, actions) => {
    await handleUpdate(item.id, values);
    actions.resetForm();
  }

  return(
    <Formik initialValues={initialValues} onSubmit={handleOnsubmit} validationSchema={validationSchema} enableReinitialize>
      <Form>
          <TextAreaInput label={"descripcion"} name={"descripcion"} id={"descripcion"}/>
          <div className={"space-x-2 flex items-center justify-end mt-8"}>
            <input type={"reset"} value={"Cancelar"} className={"secondary-btn w-32"} onClick={handleClose}/>
            <input type={"submit"} value={"Guardar"} className={"primary-btn w-32"}/>
          </div>
      </Form>
    </Formik>
  )
}
