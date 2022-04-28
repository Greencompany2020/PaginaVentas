import {Formik, Form, Field} from 'formik';
import { meses } from '../../utils/data'


const DashboardForm = ({userValues}) => {

    const initialValues = {
        year: 2022,
        month: 0,
        iva:userValues?.configuracion?.iva[1] || false,
        eventos: userValues?.configuracion?.eventos[1] || false,
        agnoSinVenta: userValues?.configuracion?.agnoSinVenta[1] || false,
        cerrada: userValues?.configuracion?.cerrada[1] || false,
        suspendida: userValues?.configuracion?.suspendida[1] || false,
        pesos: userValues?.configuracion?.pesos[1] || false,
    }

    return(
        
        <div>
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => alert(JSON.stringify(values))}
            >
                <Form>
                    <div className=' flex flex-col space-y-6 p-4'>

                        <div className='space-y-4'>

                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="month" className='font-bold text-gray-600'>Valor para mes:</label>
                                <Field as='select' name='month' id='month'  className='border-2 rounded-md h-10'>
                                    <option value={'current'} defaultValue> Mes Actual </option>
                                    {meses.map((item, index) => (
                                        <option value={item.value} key={index}>{item.text}</option>
                                    ))}
                                </Field>
                            </div>
                            
                            <div className='flex flex-col space-y-1'>
                                <label htmlFor="year" className='font-bold text-gray-600'>Valor para año:</label>
                                <Field type='number' name='year' id='year' className='border-2 rounded-md h-10'/>
                            </div>
                        </div>
                       
                        <div className='space-y-1'>
                            {
                                (userValues?.configuracion?.iva[0] == 'enabled') ?
                                <>
                                    <div className='space-x-2'>
                                    <Field type="checkbox" name='iva' id='iva' {...initialValues.iva[1] && 'checked = true'}/>
                                    <label htmlFor="iva" className='font-semibold text-gray-600 cursor-pointer'>Ventas con IVA:</label>
                                    </div>   
                                </> :
                                null
                                
                            }
                          

                            {
                                (userValues?.configuracion?.eventos[0] == 'enabled') ?
                                <>
                                    <div  className='space-x-2'>
                                    <Field type="checkbox" name='events' id='events' {...initialValues.eventos[1] && 'checked = true'}/>
                                    <label htmlFor="events" className='font-semibold text-gray-600 cursor-pointer'>Incluir venta de eventos</label>
                                    </div>
                                </>:
                                null
                        
                            }

                            {
                                (userValues?.configuracion?.agnoSinVenta[0] == 'enabled') ?
                                <>
                                    <div  className='space-x-2'>
                                    <Field type="checkbox" name='idk' id='idk' {...initialValues.agnoSinVenta[1] && 'checked = true'}/>
                                    <label htmlFor="idk" className='font-semibold text-gray-600 cursor-pointer'>Excluir tiendas sin año de venta</label>
                                    </div>
                                </>:
                                null
                            }
                            
                            {
                                (userValues?.configuracion?.cerrada[0] == 'enabled') ?
                                <>
                                    <div  className='space-x-2'>
                                    <Field type="checkbox" name='closed' id='closed'/>
                                    <label htmlFor="closed" className='font-semibold text-gray-600 cursor-pointer'>Incluir tiendas Cerradas</label>
                                    </div>
                                </>:
                                null
                            }

                            {
                                (userValues?.configuracion?.suspendida[0] == 'enabled') ?
                                <>
                                    <div  className='space-x-2'>
                                    <Field type="checkbox" name='suspend' id='suspend'/>
                                    <label htmlFor="suspend" className='font-semibold text-gray-600 cursor-pointer'>Excluir tiendas suspendidas</label>
                                    </div>
                                </>:
                                null
                            }


                            {
                                (userValues?.configuracion?.pesos[0] == 'enabled') ?
                                <>
                                    <div  className='space-x-2'>
                                    <Field type="checkbox" name='dollars' id='dollars'/>
                                    <label htmlFor="dollars" className='font-semibold text-gray-600 cursor-pointer'>Resultados en pesos</label>
                                    </div>
                                </>:
                                null
                            }

                        </div>

                        <button className=' bg-cyan-400 w-28 text-white p-1 rounded-md place-self-end' type='submit'>Aplicar</button>
                    </div>
                
                </Form>
            </Formik>
        </div>
    )
}

export default DashboardForm;