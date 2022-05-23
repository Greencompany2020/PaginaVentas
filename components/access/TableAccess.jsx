import {PlusCircleIcon,TrashIcon,PencilAltIcon} from '@heroicons/react/outline';
import {Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import Pagination from '../Pagination';
import TooggleSwitch from '../inputs/TooggleSwitch';


export const AccessForm = ({toggleModal, handleSubmit, selectedAccess}) => {

    const initialValues = {
       menu: selectedAccess?.menu || '',
       reporte: selectedAccess?.reporte || '',
       point: selectedAccess?.point || ''
    }

    const validateSchema = Yup.object().shape({
        menu: Yup.string().required('Requerido'),
        reporte: Yup.string().required('Requerido'),
        point: Yup.string().required('Requerido'),
    })

    return (
        <div className='p-4'>
            <Formik
                initialValues={initialValues}
                validationSchema={validateSchema}
                onSubmit={(values) => handleSubmit(values)}
            >
                {({errors, touched}) => (
                    <Form>
                        <div className='space-y-4'>
                            <div className='space-y-2 flex flex-col'>
                                <label htmlFor="Nombre">Menu</label>
                                <Field 
                                    type='text' 
                                    name='menu'
                                    id='menu'
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    placeholder = 'Ej. Diarias'
                                />
                                {errors?.menu && touched?.menu ? <span className='font-semibold text-red-500'>{errors?.menu}</span> : null}
                            </div>

                            <div className='space-y-2 flex flex-col'>
                                <label htmlFor="Nombre">Reporte</label>
                                <Field 
                                    type='text' 
                                    name='reporte'
                                    id='reporte'
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    placeholder = 'Ej. Por tienda'
                                />
                                {errors?.reporte && touched?.reporte ? <span className='font-semibold text-red-500'>{errors?.reporte}</span> : null}
                            </div>
                            <div className='space-y-2 flex flex-col'>
                                <label htmlFor="Nombre">Direccion</label>
                                <Field 
                                    type='text' 
                                    name='point'
                                    id='point'
                                    className='h-10 border rounded-md border-slate-400 pl-2'
                                    placeholder = 'Ej. /diarias/tienda'
                                />
                                {errors?.point && touched?.point ? <span className='font-semibold text-red-500'>{errors?.point}</span> : null}
                            </div>
                        </div>


                        <div className='flex justify-end mt-8'>
                            <button
                                type='reset'
                                value='reset'
                                className='secondary-btn w-28 mr-2'
                                onClick={toggleModal}
                            >
                             Cancelar</button>

                            <button
                                type='submit'
                                value='submit'
                                className='primary-btn w-28' 
                            >
                            Guardar</button>
                        </div>
                    </Form>
                 )}
            </Formik>
        </div>
    )
}


const TableRows = ({items,updateUserAccess, handleAssign, selectAccess, handleModal, handleDelete}) => {
    if(!items) return <></>
    const rows = items.map((item, index)=> {
        const handleSwitch = () => handleAssign(item.idDashboard,item.acceso)
        return(
            <tr key={index} onClick={() => selectAccess(item)}>
                <td className='hidden lg:table-cell'>{item.menu}</td>
                <td className='hidden lg:table-cell'>{item.reporte}</td>
                <td >{item.nombreReporte}</td>
                <td className='flex justify-center space-x-1'> 
                    <PencilAltIcon 
                        width={32} className='cursor-pointer hover:text-blue-500'
                        onClick={() => handleModal('access', 'update')}
                    />
                     <TrashIcon 
                        width={32} 
                        className='cursor-pointer hover:text-blue-500'
                        onClick={() => handleDelete(item.idDashboard)}
                    />
                </td>
                <td > <TooggleSwitch key={index} id={item.idDashboard} value={item.acceso} onChange={handleSwitch}/> </td>
            </tr>
        )
    });
    return rows;
}


const TableAccess = ({data, handleSearch, pages, current, next, updateUserAccess, handleAssign, handleModal, selectAccess, handleDelete}) => {
    return(
        <div className="flex items-start space-x-1">
            <div className="flex-1 space-y-8 overflow-hidden">
                <div className=' overflow-y-auto '>
                    <table className='min-w-full'>
                        <thead className="text-left">
                            <tr>
                                <th className='bg-slate-300 rounded-l-md p-1 hidden  lg:table-cell'>Menu</th>
                                <th className='bg-slate-300 p-1 hidden lg:table-cell'>Reporte</th>
                                <th className='bg-slate-300 rounded-l-md  p-1 lg:rounded-l-none'>Nombre reporte</th>
                                <th className='bg-slate-300 p-1 text-center'>Configuracion</th>
                                <th className='bg-slate-300 rounded-r-md p-1'>Acceso</th>
                            </tr>
                            <tr>
                                <th colSpan={5}>
                                    <input
                                        className=" bg-yellow-100 w-full rounded-md border-2 h-8 pl-2"
                                        placeholder='Buscar...'
                                        onChange={handleSearch}
                                    />
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <TableRows 
                                items={data} 
                                updateUserAccess={updateUserAccess} 
                                handleAssign={handleAssign}  
                                selectAccess={selectAccess}
                                handleModal={handleModal}
                                handleDelete={handleDelete}
                            />
                        </tbody>
                    </table>
                </div>
                <Pagination pages={pages} current={current} next={next}/>
            </div>
            <PlusCircleIcon 
                width={32} 
                onClick={() => handleModal('access', 'create')}
                className='block cursor-pointer hover:text-blue-500'
            />
        </div>
    )
}

export default TableAccess;