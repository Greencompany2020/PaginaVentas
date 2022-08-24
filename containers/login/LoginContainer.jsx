import React from 'react';
import { Formik, Form} from "formik";
import * as Yup from "yup";
import authService from '../../services/authService';
import jsCookie from "js-cookie";
import { useRouter } from 'next/router';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import {LoginInput, ResetViewInput} from '../../components/FormInputs';
import { useDispatch } from 'react-redux';
import setInitialData from '../../redux/actions/setInitialData';

export default function LoginContainer(props) {
    const {setLoading} =props
    const router = useRouter();
    const service = authService();
    const dispatch = useDispatch();
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
      const { accessToken } = response;
      jsCookie.set('accessToken', accessToken);
      const data = await service.getUserData();
      dispatch(setInitialData(data));
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
          <LoginInput type='text' name='UserCode' placeholder='Usuario'/>
          <ResetViewInput type='password' name='password' placeholder='Contraseña'/>
        </fieldset>
        <input type='submit' value='Ingresar' className="primary-btn  w-full mt-4"/>
      </Form>
    </Formik>
   )
}

