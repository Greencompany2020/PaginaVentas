import React from 'react';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import authService from '../../services/authService';
import jsCookie from "js-cookie";
import { useRouter } from 'next/router';
import {useAuth} from '../../context/AuthContext';
import { useNotification } from '../../components/notifications/NotificationsProvider';

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

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="space-y-4">
              <div className="flex flex-col justify-start">
                <Field
                  type="text"
                  placeholder="Usuario"
                  name="UserCode"
                  id="UserCode"
                  className={`rounded-md p-3 outline-none  ${
                    errors?.UserCode && touched?.UserCode
                      ? "border-[3px] border-red-500"
                      : null
                  }`}
                />
                {errors?.UserCode && touched?.UserCode ? (
                  <span className="font-semibold text-red-500">
                    {errors?.UserCode}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col justify-start">
                <Field
                  type="password"
                  placeholder="Contraseña"
                  name="password"
                  id="password"
                  className={`rounded-md p-3 outline-none  ${
                    errors?.password && touched?.password
                      ? "border-[3px] border-red-500"
                      : null
                  }`}
                />
                {errors?.password && touched?.password ? (
                  <span className="font-semibold text-red-500">
                    {errors?.password}
                  </span>
                ) : null}
              </div>
            </div>

            <button type="submit" className="primary-btn w-full mt-4">
              Iniciar sesion
            </button>
          </Form>
        )}
      </Formik>
    );
}

