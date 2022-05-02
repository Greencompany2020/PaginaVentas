import Image from "next/image";
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import Logo from '../public/images/green-company.png';
export default function RestorePassword(){

    const validationSchema = Yup.object().shape({
        Password: Yup.string().min(4, 'La contraseña es muy corta').required('Es necesario rellenar este campo'),
        ConfirmPassword: Yup.string().oneOf([Yup.ref('Password'), null], 'Las contraseñas no coinciden').required('Es necesario rellenar este campo')
    }) 

    const initialValues = {
        Password: '',
        ConfirmPassword: ''
    }

    const handleSubmit = (values) => console.log(values);

    return(
        <div className=" h-screen">
            <div className="h-full grid place-items-center">
                <div className="h-fit w-full grid place-items-center sm:w-[50%]  md:w-[20%]">
                    <div className="w-full p-4 ">
                        <Image src={Logo} alt="Green Company" className=" object-fill h-40" />
                        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={values => handleSubmit(values)}>
                            {({errors, touched})=>(
                                 <Form>
                                    <div className="flex flex-col space-y-5">
                                        <Field 
                                            type="password" 
                                            name="Password" 
                                            id="Password" 
                                            placeholder="Nueva contraseña"
                                            className={`border-2 rounded-md h-10 pl-3 ${(errors?.Password && touched?.Password) && 'border-red-500'}`}
                                        />
                                        {(errors?.Password && touched?.Password) && <span>{errors?.Password}</span>}
                                        <Field 
                                            type="password" 
                                            name="ConfirmPassword" 
                                            id="ConfirmPassword" 
                                            placeholder="Confirmar contraseña"
                                            className={`border-2 rounded-md h-10 pl-3 ${(errors?.ConfirmPassword && touched?.ConfirmPassword) && 'border-red-500'}`}
                                        />
                                         {(errors?.ConfirmPassword && touched?.ConfirmPassword) && <span>{errors?.ConfirmPassword}</span>}
                                    </div>
                                    <button 
                                        type="submit"
                                        className="bg-sky-500 h-12 w-full text-white rounded-md mt-10"
                                    >Guardar</button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}