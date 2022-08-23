import React from 'react';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import userService from '../../services/userServices';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import { LoginInput } from '../../components/FormInputs';

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
            message:'Correo no registrado'
          })
        }
        setLoading();
    }

   return(
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSendResetRequest}>
      <Form>
          <fieldset>
            <LoginInput type='email' name='email' placeholder='Email@example.com'/>
          </fieldset>
          <input type='submit' value='Solicitar cambio' className="primary-btn  w-full mt-4"/>
      </Form>
    </Formik>
   )
}



