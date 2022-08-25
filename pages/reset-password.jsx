import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import { Formik, Form} from "formik";
import * as Yup from "yup";
import logo from "../public/images/brand.svg";
import useToggle from "../hooks/useToggle";
import LoaderComponentBas from "../components/LoaderComponentBas";
import userService from '../services/userServices';
import {useNotification} from'../components/notifications/NotificationsProvider';
import { ResetViewInput } from "../components/FormInputs";

export default function RestorePassword() {
  const router = useRouter();
  const service = userService();
  const [isLoading, setLoading] = useToggle(false);
  const sendNotification = useNotification();

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(4, "La contraseña es muy corta")
      .required("Es necesario rellenar este campo"),
    confirmPassword: Yup.string()
      .min(4, "La contraseña es muy corta")
      .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
      .required("Es necesario rellenar este campo"),
  });

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const sendNewPassword = async (values) => {
    if(router.query?.resetToken){
      setLoading();
      const { resetToken } = router.query;
      const body = { password: values.password };
      try {
        const response = await service.resetPassword(body, resetToken);
        sendNotification({
          type:'OK',
          message:'Se ha restablecido su contraseña'
        });
        awaitToRedirect();
      } catch (error) {
        sendNotification({
          type:'ERROR',
          message:error.response.data.message || error.message
        });
      }
      setLoading();
    }else{
      sendNotification({
        type:'ERROR',
        message: 'No puede restablecer su cantraseña sin token'
      })
    }
  }

  const awaitToRedirect = () =>{
    setTimeout(() => {
      router.push('/');
    }, 2000);
  }

  const handleSubmit = (values) => sendNewPassword(values);

  return(
    <section className=" h-screen grid place-items-center bg-cyan-600 p-4">
      <div className="w-full md:w-[50%] xl:w-[20%] min-h-[30rem] h-fit p-4 bg-gray-50 rounded-md shadow-sm shadow-slate-800">

        <figure className="relative w-full h-44">
          <Image src={logo} layout='fill' alt="logo"/>
        </figure>

        <div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            <Form>
              <fieldset className='space-y-4'>
                < ResetViewInput type='password' name='password' placeholder='Constraseña'/>
                < ResetViewInput type='password' name='confirmPassword' placeholder='Confirmar contraseña'/>
              </fieldset>
              <input type='submit' value='Ingresar' className="primary-btn  w-full mt-4"/>
            </Form>
          </Formik>
          <LoaderComponentBas isLoading={isLoading} />
        </div>
        <div className="text-center mt-8">
        <Link href="/">
            <a className="text-sm cursor-pointer text-sky-500  font-semibold">
              Ir a Inicio
            </a>
        </Link>
        </div>
      </div>
   </section>
  )
}

