import Image from "next/image";
import {useState} from "react";
import {useRouter} from 'next/router'
import {EyeIcon, EyeOffIcon} from '@heroicons/react/outline' 
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import Logo from '../public/images/green-company.png';
import { post_newPassword } from "../services/UserServices";
import { MessageModal } from '../components/modals';
import useMessageModal from '../hooks/useMessageModal';
import LoaderComponent from "../components/LoaderComponent";
import useToggle from "../hooks/useToggle";


export default function RestorePassword(){
    const router = useRouter();
    const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();
    const [isLoading, setLoading] = useToggle(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);



    const validationSchema = Yup.object().shape({
        password: Yup.string().min(4, 'La contraseña es muy corta').required('Es necesario rellenar este campo'),
        confirmPassword: Yup.string().min(4, 'La contraseña es muy corta').oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden').required('Es necesario rellenar este campo')
    }) 

    const initialValues = {
        password: '',
        confirmPassword: ''
    }

    const sendNewPassword = async (values) =>{
        const body = {password:values.password}
        if(!router.query?.resetToken) return false;
        const {resetToken} = router.query;
        setLoading(false);
        const response = await post_newPassword(body, resetToken);
        setLoading(false);
        const mesage =  response ? 'Su contraseña ha sido cambiada' : 'No se pudo restablecer su contraseña';
        setMessage(mesage);
        setModalOpen(true);
        if(response) window.location.href = '/'
        
    }

    const handleSubmit = (values) => sendNewPassword(values);
    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirm = () => setShowConfirm(!showConfirm);

    return(
       <>
        <MessageModal/>
        <div className="w-screen h-screen grid place-items-center p-3 bg-cyan-600">
            <div className="flex flex-col  p-4  rounded-md bg-gray-200">
                <div className=" w-2/3 m-auto mb-4">
                    <Image src={Logo} alt="Green Company" className=" object-fill h-40" />
                </div>
                <h1 className="text-center text-xl mb-4 font-semibold text-gray-500">Restablecer Contraseña</h1>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={values => handleSubmit(values)}>
                    {({ errors, touched }) => (
                        <Form>
                            <div className='space-y-4'>

                                <div className='flex flex-col justify-start'>
                                    <figure 
                                        className={`flex items-center p-1 pr-2 rounded-md bg-white outline-none ${(errors?.password && touched?.password) && 'border-[3px] border-red-500' }`}
                                    >
                                        <Field
                                            type={ showPassword ? 'text' : 'password'}
                                            placeholder='Contraseña'
                                            name='password'
                                            id='password'
                                            className=' w-full outline-none p-3'
                                        />
                                       {
                                           showPassword ?
                                           <EyeOffIcon width={32} className='text-blue-500 hover:cursor-pointer' onClick={handleShowPassword}/>  :  
                                           <EyeIcon width={32} className='text-blue-500 hover:cursor-pointer' onClick={handleShowPassword}/> 
                                           
                                       }
                                    </figure> 
                                    {errors?.password && touched?.password ? <span className='font-semibold text-red-500'>{errors?.password}</span> : null}
                                </div>

                                <div className='flex flex-col justify-start'>
                                    <figure
                                         className={`flex items-center p-1 pr-2 rounded-md bg-white outline-none ${(errors?.confirmPassword && touched?.confirmPassword) && 'border-[3px] border-red-500' }`}
                                    >
                                        <Field
                                            type={ showConfirm ? 'text' : 'password'}
                                            placeholder='Confirmar contraseña'
                                            name='confirmPassword'
                                            id='confirmPassword'
                                            className='w-full outline-none p-3'
                                        />
                                        {
                                           showConfirm ?
                                           <EyeOffIcon width={32} className='text-blue-500 hover:cursor-pointer' onClick={handleShowConfirm}/>  :  
                                           <EyeIcon width={32} className='text-blue-500 hover:cursor-pointer' onClick={handleShowConfirm}/> 
                                        }
                                    </figure>                        
                                    {errors?.confirmPassword && touched?.confirmPassword ? <span className='font-semibold text-red-500'>{errors?.confirmPassword}</span> : null}
                                </div>

                            </div>

                            <button
                            type='submit'
                            className='w-full h-12 rounded-md bg-sky-500 mt-4 text-center text-white hover:cursor-pointer hover:bg-sky-400 transition ease-in-out duration-200 font-bold'
                            >Solicitar cambio</button>
                        </Form>
                    )}
                </Formik>
                <LoaderComponent isLoading={isLoading}/>
                <Link href='/'>
                    <a className="text-lg cursor-pointer text-sky-500 text-center mt-8 font-semibold">Ir a Inicio</a>
                </Link>
            </div>
        </div>
       </>
    )
}