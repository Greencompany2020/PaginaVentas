import React from 'react';
import {Form, Formik} from 'formik';
import {TextAreaInput} from "../FormInputs";
import * as Yup from 'yup';

export default  function ContainerUpdateForm({item}){

  const validationSchema = Yup.object().shape({
    desccripcion: Yup.string().required("Requerido"),
  })

  const initialValues = {
    descripcion: item?.descripcion || ''
  }

  const handleOnsubmit = (values, {resetForm}) => {

  }

  return(
    <Formik initialValues={initialValues} onSubmit={handleOnsubmit} validationSchema={validationSchema}>
      <Form>
          <TextAreaInput label={"decripcion"} name={"descripcion"} id={"descripcion"}/>
          <div className={"space-x-2 flex items-center"}>
            <input type={"reset"} value={"Cancelar"} className={"secondary-btn w-32"}/>
            <input type={"submit"} value={"Guardar"} className={"primary-btn w-32"}/>
          </div>
      </Form>
    </Formik>
  )
}
