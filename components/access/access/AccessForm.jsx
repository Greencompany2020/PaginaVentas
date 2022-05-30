import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

export default function AccessForm(props) {
  const { item, handleSubmit, toggleVisible } = props;
  const initialValues = {
    menu: item?.menu || "",
    reporte: item?.reporte || "",
    point: item?.point || "",
  };

  const validateSchema = Yup.object().shape({
    menu: Yup.string().required("Requerido"),
    reporte: Yup.string().required("Requerido"),
    point: Yup.string().required("Requerido"),
  });

  return (
    <div className="p-4">
      <Formik
        initialValues={initialValues}
        validationSchema={validateSchema}
        onSubmit={(values) => {
          if (!item) {
            handleSubmit(values);
          } else {
            handleSubmit(item.idDashboard, values);
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="space-y-4">
              <div className="space-y-2 flex flex-col">
                <label htmlFor="Nombre">Menu</label>
                <Field
                  type="text"
                  name="menu"
                  id="menu"
                  className="h-10 border rounded-md border-slate-400 pl-2"
                  placeholder="Ej. Diarias"
                />
                {errors?.menu && touched?.menu ? (
                  <span className="font-semibold text-red-500">
                    {errors?.menu}
                  </span>
                ) : null}
              </div>

              <div className="space-y-2 flex flex-col">
                <label htmlFor="Nombre">Reporte</label>
                <Field
                  type="text"
                  name="reporte"
                  id="reporte"
                  className="h-10 border rounded-md border-slate-400 pl-2"
                  placeholder="Ej. Por tienda"
                />
                {errors?.reporte && touched?.reporte ? (
                  <span className="font-semibold text-red-500">
                    {errors?.reporte}
                  </span>
                ) : null}
              </div>
              <div className="space-y-2 flex flex-col">
                <label htmlFor="Nombre">Direccion</label>
                <Field
                  type="text"
                  name="point"
                  id="point"
                  className="h-10 border rounded-md border-slate-400 pl-2"
                  placeholder="Ej. /diarias/tienda"
                />
                {errors?.point && touched?.point ? (
                  <span className="font-semibold text-red-500">
                    {errors?.point}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="reset"
                value="reset"
                className="secondary-btn w-28 mr-2"
                onClick={toggleVisible}
              >
                Cancelar
              </button>

              <button type="submit" value="submit" className="primary-btn w-28">
                Guardar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

