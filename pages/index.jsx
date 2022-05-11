import Head from 'next/head';
import Image from 'next/image';
import Logo from '../public/images/green-company.png';
import {useState} from 'react'
import { useRouter } from 'next/router';
import {Formik, Form, Field} from 'formik'
import useAuth from '../hooks/useAuth';
import * as Yup from 'yup';
import witAuth from '../components/withAuth';
import { MessageModal } from '../components/modals';
import useMessageModal from '../hooks/useMessageModal';
import { post_resetPassword } from '../services/UserServices';
import { useUser } from '../context/UserContext';


export const Home = () => {

  const auth = useAuth();
  const router = useRouter();
  const {getUserData, getPlazas, getTiendas} = useUser();
  const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();
  const [attemptLogin ,setAttemp] = useState(true);

  const handleChange = () => setAttemp(!attemptLogin);

  const login = async (values) => {
    const response = await auth.login(values);
    if(!response){
      setMessage('Usuario o contraseña invalido');
      setModalOpen(true);
    }
    else{
      getUserData();
      getPlazas();
      getTiendas();
      router.push('/dashboard');
    }
    
  }

  const resetPassword = async (values) => {
    const data = await post_resetPassword(values);
    const mesage = data ? 'Se ha enviado un link a su correo electronico' : 'Este correo no existe';
    setMessage(mesage);
    setModalOpen(true);
  }

  const handleLogin = values => login(values);
  const handleReset = values => resetPassword(values);


  const LoginForm = ({handleLogin}) => {

    const validationSchema = Yup.object().shape({
      UserCode: Yup.string().required('Requerido'),
      password: Yup.string().required('Requerido'),
    });
  
    const initialValues = {
      UserCode: '',
      password: '',
    }

    return(
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
      >
        {({ errors, touched }) => (
          <Form>
            <div className='space-y-1'>
              <div className='flex flex-col justify-start h-20 '>
                <Field
                  type='text'
                  placeholder='Ususario'
                  name='UserCode'
                  id='UserCode'
                  className={`rounded-md p-3 outline-none  ${errors?.UserCode && touched?.UserCode ? 'border-[3px] border-red-500' : null}`}
                />
                {errors?.UserCode && touched?.UserCode ? <span className='font-semibold text-red-500'>{errors?.UserCode}</span> : null}
              </div>

              <div className='flex flex-col justify-start h-20'>
                <Field
                  type='password'
                  placeholder='Contraseña'
                  name='password'
                  id='password'
                  className={`rounded-md p-3 outline-none  ${errors?.password && touched?.password ? 'border-[3px] border-red-500' : null}`}
                />
                {errors?.password && touched?.password ? <span className='font-semibold text-red-500'>{errors?.password}</span> : null}
              </div>

              <div className="flex items-center justify-end">
                <label htmlFor="rememberPass" className="text-lg">Recordar contraseña</label>
                <Field
                  type='checkbox'
                  name='remenberPass'
                  id='rememberPass'
                  className="ml-2 w-4 h-4"
                />
              </div>
            </div>

            <button
              type='submit'
              className='w-full h-12 rounded-md bg-sky-500 mt-4 sm:mt-10 md:mt-16 lg:mt-12 text-center text-gray-200 hover:cursor-pointer hover:bg-sky-400 transition ease-in-out duration-200 font-bold'
            >Iniciar sesion</button>
          </Form>
        )}
      </Formik>
    )
  }

  const ForgotForm = ({handleReset}) => {
    const validationSchema = Yup.object().shape({
      email: Yup.string().email('Ingrese un correo valido').required('Requerido')
    });
  
    const initialValues = {
      email: '',
    }

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => handleReset(values)}
      >
        {({ errors, touched }) => (
          <Form>
            <div className='space-y-1'>
              <div className='flex flex-col justify-start h-20'>
                <Field
                  type='text'
                  placeholder='Example@greencompany.biz'
                  name='email'
                  id='email'
                  className={`rounded-md p-3 outline-none  ${errors?.email && touched?.email ? 'border-[3px] border-red-500' : null}`}
                />
                {errors?.email && touched?.email ? <span className='font-semibold text-red-500'>{errors?.email}</span> : null}
              </div>
            </div>

            <button
              type='submit'
              className='w-full h-12 rounded-md bg-sky-500 mt-4 text-center text-gray-200 hover:cursor-pointer hover:bg-sky-400 transition ease-in-out duration-200 font-bold'
            >Solicitar cambio</button>
          </Form>
        )}
      </Formik>
    )
  }


  return (
    <>
      <MessageModal message={message} setModalOpen={setModalOpen} modalOpen={modalOpen} />
      <Head>Ventas</Head>
      <section className='h-screen bg-cyan-600 grid  place-items-center'>
        <div className='bg-gray-200 w-4/5  md:w-2/4  xl:w-1/4  rounded-xl p-8'>
            <div className='flex flex-col justify-center p-4'>
              <div className=" w-2/3 m-auto mt-10 mb-1">
                <Image src={Logo} alt="Green Company" className=" object-fill h-40" />
              </div>
                {attemptLogin ?  <LoginForm handleLogin={handleLogin}/> : <ForgotForm handleReset={handleReset}/> }
                { attemptLogin ? 
                  <a onClick={handleChange} className=' text-lg cursor-pointer text-sky-500 text-center mt-5'>Olvide Mi contraseña</a> :
                  <a onClick={handleChange} className=' text-lg cursor-pointer text-sky-500 text-center mt-5'>Regresar</a>
                }
            </div>
        </div>
      </section>
    </>
  )
}

export default witAuth(Home);
