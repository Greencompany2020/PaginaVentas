import Image from "next/image";
import {useRouter} from 'next/router'
import Link from "next/link";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import Logo from '../public/images/green-company.png';
import { post_newPassword } from "../services/UserServices";
import { MessageModal } from '../components/modals';
import useMessageModal from '../hooks/useMessageModal';


export default function RestorePassword(){
    const router = useRouter();
    const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();

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
        const response = await post_newPassword(body, resetToken);
        const mesage =  response ? 'Su contraseña ha sido cambiada' : 'upsss problemas';
        setMessage(mesage);
        setModalOpen(true);
        
    }

    const handleSubmit = (values) => sendNewPassword(values);

    return(
        <>
            <MessageModal message={message} setModalOpen={setModalOpen} modalOpen={modalOpen} />
            <div className=" h-screen">
                <div className="h-full grid place-items-center">
                    <div className="h-fit w-full grid place-items-center sm:w-[50%]  md:w-[20%]">
                        <div className="w-full p-4 ">
                            <Image src={Logo} alt="Green Company" className=" object-fill h-40" />
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={values => handleSubmit(values)}>
                                {({errors, touched})=>(
                                    <Form>
                                        <div className="flex flex-col">
                                            <div className="flex flex-col h-20">
                                                <Field 
                                                    type="password" 
                                                    name="password" 
                                                    id="password" 
                                                    placeholder="Nueva contraseña"
                                                    className={`border-2 rounded-md h-10 pl-3 ${(errors?.password && touched?.password) && 'border-red-500'}`}
                                                />
                                                {(errors?.password && touched?.password) && <span className="font-semibold text-red-500">{errors?.password}</span>}
                                                </div>
                                            <div className="flex flex-col h-20">
                                                <Field 
                                                    type="password" 
                                                    name="confirmPassword" 
                                                    id="confirmPassword" 
                                                    placeholder="Confirmar contraseña"
                                                    className={`border-2 rounded-md h-10 pl-3 ${(errors?.confirmPassword && touched?.confirmPassword) && 'border-red-500'}`}
                                                />
                                                {(errors?.confirmPassword && touched?.confirmPassword) && <span className="font-semibold text-red-500">{errors?.confirmPassword}</span>}
                                            </div>
                                        </div>
                                        <button 
                                            type="submit"
                                            className="bg-sky-500 h-12 w-full text-white rounded-md mt-1 font-bold"
                                        >Guardar</button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <Link href='/'>
                                <a className="text-lg cursor-pointer text-sky-500">Volver al inicio</a>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}