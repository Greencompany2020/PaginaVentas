import Head from "next/head";
import Image from "next/image";
import Logo from "../public/images/green-company.png";
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import useAuth from "../hooks/useAuth";
import * as Yup from "yup";
import witAuth from "../components/withAuth";
import { post_resetPassword } from "../services/UserServices";
import LoaderComponentBas from "../components/LoaderComponentBas";
import useToggle from "../hooks/useToggle";
import { useAlert } from "../context/alertContext";

export const Home = () => {
  const alert = useAlert();
  const auth = useAuth();
  const [attemptLogin, setAttemp] = useState(true);
  const [isLoading, setLoading] = useToggle(false);

  const handleChange = () => setAttemp(!attemptLogin);
  const login = async (values) => {
    setLoading(true);
    const response = await auth.login(values);
    setLoading(false);
    if (response) {
      window.location.href = "/dashboard";
    } else {
      alert.showAlert("Usuario no valido", "warning", 1000);
    }
  };

  const resetPassword = async (values) => {
    setLoading(true);
    const data = await post_resetPassword(values);
    setLoading(false);
    if (data) {
      alert.showAlert(
        "Se ha enviado un link a su correo electronico",
        "info",
        1000
      );
      handleChange();
    } else {
      alert.showAlert("Este correo no existe", "warning", 1000);
    }
  };

  const handleLogin = (values) => login(values);
  const handleReset = (values) => resetPassword(values);

  const LoginForm = () => {
    const validationSchema = Yup.object().shape({
      UserCode: Yup.string().required("Requerido"),
      password: Yup.string().required("Requerido"),
    });

    const initialValues = {
      UserCode: "",
      password: "",
    };

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
  };

  const ForgotForm = () => {
    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .email("Ingrese un correo valido")
        .required("Requerido"),
    });

    const initialValues = {
      email: "",
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleReset(values)}
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
  };

  return (
    <>
      <Head>Ventas</Head>
      <section className="h-screen bg-cyan-600 grid place-items-center p-3">
        <div className="bg-gray-200  rounded-md p-3">
          <div className="flex flex-col justify-center p-4">
            <div className=" w-2/3 m-auto mb-1">
              <Image
                src={Logo}
                alt="Green Company"
                className=" object-fill h-40"
              />
            </div>
            {attemptLogin ? <LoginForm /> : <ForgotForm />}
            <LoaderComponentBas isLoading={isLoading} />
            {attemptLogin ? (
              <a
                onClick={handleChange}
                className=" text-lg cursor-pointer text-sky-500 text-center mt-8 font-semibold"
              >
                Olvide Mi contraseña
              </a>
            ) : (
              <a
                onClick={handleChange}
                className=" text-lg cursor-pointer text-sky-500 text-center mt-8 font-semibold"
              >
                Regresar
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default witAuth(Home);
