import React from 'react';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import userService from '../../services/userServices';
import { useNotification } from '../../components/notifications/NotificationsProvider';

export default function ResetPasswordContainer(props) {
    const { setLoading } = props;
    const service = userService();
    const sendNotification = useNotification();

    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .email("Ingrese un correo valido")
        .required("Requerido"),
    });

    const initialValues = {
      email: "",
    };

    const handleSendResetRequest = async ( values) => {
        setLoading();
        try {
          const response = await service.requestPasswordReset(values);
          if(response){
            sendNotification({
              type:'OK',
              message:'Se ha enviado un link a su correo'
            })
          }
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message:error.message
          })
        }
        setLoading();
    }

    return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => handleSendResetRequest(values)}
    >
      {({ errors, touched }) => (
        <Form>
          <div className="space-y-1">
            <div className="flex flex-col justify-start">
              <Field
                type="text"
                placeholder="Example@greencompany.biz"
                name="email"
                id="email"
                className={`rounded-md p-3 outline-none  ${
                  errors?.email && touched?.email
                    ? "border-[3px] border-red-500"
                    : null
                }`}
              />
              {errors?.email && touched?.email ? (
                <span className="font-semibold text-red-500">
                  {errors?.email}
                </span>
              ) : null}
            </div>
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-md bg-sky-500 mt-4 text-center text-gray-200 hover:cursor-pointer hover:bg-sky-400 transition ease-in-out duration-200 font-bold"
          >
            Solicitar cambio
          </button>
        </Form>
      )}
        </Formik>
    );
}



