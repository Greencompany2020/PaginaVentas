import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { TextInput, SelectInput } from "../../FormInputs";

export default function AccessForm(props) {
  const { item, updateAccess, addNewAccess, handleModal, proyects } = props;

  const initialValues = {
    idProyect: item?.idProyecto || 1,
    menu: item?.menu || "",
    reporte: item?.reporte || "",
    point: item?.point || "",
  };

  const validateSchema = Yup.object().shape({
    idProyect: Yup.number().required("Requerido"),
    menu: Yup.string().required("Requerido"),
    reporte: Yup.string().required("Requerido"),
    point: Yup.string().required("Requerido"),
  });

  const handleOnsubmit = async (values, { resetForm }) => {
    if (item) {
      await updateAccess(item.idDashboard, values);
    } else {
      await addNewAccess(values);
    }
    handleModal();
    resetForm({});
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validateSchema} onSubmit={handleOnsubmit} enableReinitialize>
      <Form className="p-4">
        <div className="space-y-1">
          <SelectInput label="Proyecto" name="idProyect">
            {
              proyects ?
                proyects.map(item => (
                  <option key={item.Id} value={item.Id}>{item.Nombre}</option>
                ))
                :
                null
            }
          </SelectInput>
          <TextInput label='Menu' name='menu' />
          <TextInput label='Reporte' name='reporte' />
          <TextInput label='Direccion' name='point' />
        </div>
        <div className="flex flex-row justify-end space-x-2 mt-6">
          <input type='reset' value='Cancelar' className="secondary-btn w-28" onClick={handleModal} />
          <input type='submit' value='Guardar' className="primary-btn w-28" />
        </div>
      </Form>
    </Formik>
  );
}

