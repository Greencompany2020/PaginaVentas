import React from 'react';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from '../../services/authService';
import jsCookie from "js-cookie";
import { useRouter } from 'next/router';
import {useAuth} from '../../context/AuthContext';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import {TextInput} from '../../components/FormInputs'

export default function LoginContainer(props) {
    const {setLoading} =props
    const router = useRouter();
    const service = authService();
    const {setAuth} = useAuth();
    const sendNotification = useNotification();
    const validationSchema = Yup.object().shape({
        UserCode: Yup.string().required("Requerido"),
        password: Yup.string().required("Requerido"),
    });
  
    const initialValues = {
        UserCode: "",
        password: "",
    };

    const handleLogin = async (values) => {
        setLoading();
        try {
          const response = await service.login(values);
          const {accessToken} = response;
          jsCookie.set('accessToken', accessToken);
          setAuth(true);
          router.push('/dashboard');
        } catch (error) {
         sendNotification({
          type: 'ERROR',
          message: 'Usuario no valido'
         });
        }
        setLoading();
    }

   return(
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleLogin}>
      <Form>
        <fieldset className='space-y-4'>
          <TextInput type='text' name='UserCode' placeholder='Usuario'/>
          <TextInput type='password' name='password' placeholder='Contraseña'/>
        </fieldset>
        <input type='submit' value='Ingresar' className="primary-btn  w-full mt-4"/>
      </Form>
    </Formik>
   )
}

