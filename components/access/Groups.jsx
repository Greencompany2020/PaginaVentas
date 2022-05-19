import {PlusCircleIcon, PencilAltIcon, TrashIcon} from '@heroicons/react/outline';
import {Form, Formik, Field} from 'formik'
import * as Yup from 'yup'

export const GroupForm = ({handleSubmit, selectedGroup, toggleModal}) => {
    const initialValues = {
        Id_proyect: selectedGroup?.Id_proyect || 1,
        Nombre: selectedGroup?.Nombre || ''
    }

    const validateSchema = Yup.object().shape({
        Id_proyect: Yup.number().required('Requerido'),
        Nombre: Yup.string().required("Requerido"),
    })
    return(
        <div className='p-4'>
            <Formik
                initialValues={initialValues}
                validationSchema={validateSchema}
                onSubmit={(values) => handleSubmit(selectedGroup?.Id,values)}
            >
                {({errors, touched}) => (
                    <Form>
                        <div className='space-y-2 flex flex-col'>
                            <label htmlFor="Nombre">Nombre</label>
                            <Field 
                                type='text' 
                                name='Nombre'
                                id='Nombre'
                                className='h-10 border rounded-md border-slate-400 pl-2'
                                placeholder = 'ej. Administradores'
                            />
                            {errors?.Nombre && touched?.Nombre ? <span className='font-semibold text-red-500'>{errors?.Nombre}</span> : null}
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

const GroupList = ({items, handleSelect, handleModal, handleDelete}) => {
    if(!items) return <></>
    const itemsList = items.map((item, index) => (
            <li key={index} className="flex w-full justify-between hover:bg-slate-200 rounded-md p-1 cursor-pointer" onClick={()=>handleSelect(item)}>
                <span>{item.Nombre}</span>
                <div className='flex'>
                    <PencilAltIcon width={26} onClick={() => handleModal('groups', 'update')}/>
                    <TrashIcon width={26} onClick={() =>handleDelete(item.Id)}/>
                </div>
            </li>
    ));
    return itemsList;
}

const Groups = ({groups, handleModal, handleSelect, handleDelete}) => {
    return(
        <div className="flex-[1]">
            <div className="flex  items-start space-x-1">
                <div className="flex-1">
                    <span className=" block font-bold text-md bg-slate-300 rounded-md p-1 mb-1">Grupos</span>
                    <input
                        className=" bg-yellow-100 w-full rounded-md border-2 h-8 pl-2"
                    />
                    <ul className="space-y-2 mt-3">
                        <GroupList items={groups} handleSelect={handleSelect} handleModal={handleModal} handleDelete={handleDelete}/>
                    </ul>
                </div>
                <PlusCircleIcon width={32} className="block cursor-pointer" onClick={()=> handleModal('groups', 'create')}/>
            </div>
        </div>
    )
}

export default Groups;
