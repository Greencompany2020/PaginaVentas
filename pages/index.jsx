import Head from 'next/head';
import Image from 'next/image';
import Logo from '../public/images/green-company.png';
import {Formik, Form, Field} from 'formik'
import { useAuth } from '../context/AuthContext';
import * as Yup from 'yup';
import witAuth from '../components/withAuth';
import { MessageModal } from '../components/modals';
import useMessageModal from '../hooks/useMessageModal';



export const Home = () => {

  const auth = useAuth();
  const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();
 

  const validationSchema = Yup.object().shape({
    UserCode: Yup.string().required('Requerido'),
    password: Yup.string().required('Requerido'),
  });

  const initialValues = {
    UserCode: '',
    password: '',
  }

  const login = async (values) =>{

    if(!await auth.login(values)){
      setMessage('Usuario o contraseña invalido');
      setModalOpen(true);
    }
  }

  const handleSubmit = values => {
   login(values)
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
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit = {(values) => handleSubmit(values)}
              >
                {({errors, touched}) => (
                  <Form>
                    <div className='space-y-1'>
                      <div className='flex flex-col justify-start h-24 '>
                        <Field 
                          type='text' 
                          placeholder='Ususario' 
                          name='UserCode' 
                          id='UserCode'
                          className={`rounded-md p-3 outline-none  ${errors?.UserCode && touched?.UserCode ? 'border-[3px] border-red-500': null}`}
                        />
                        {errors?.UserCode && touched?.UserCode ? <span className='font-semibold text-red-500'>{errors?.UserCode}</span>: null}
                      </div>
                    
                      <div className='flex flex-col justify-start h-24 '>
                        <Field 
                          type='password' 
                          placeholder='Contraseña' 
                          name='password' 
                          id='password'
                          className={`rounded-md p-3 outline-none  ${errors?.password && touched?.password ?'border-[3px] border-red-500' : null}`}
                        />
                      {errors?.password && touched?.password ? <span className='font-semibold text-red-500'>{errors?.password}</span> : null}
                      </div>
                    
                      <div className="flex items-center justify-end">
                        <label htmlFor="rememberPass"  className="text-md">Recordar contraseña</label>
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
            </div>
        </div>
      </section>
    </>
  )
}

export default witAuth(Home);
