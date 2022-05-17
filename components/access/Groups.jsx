import {PlusCircleIcon, PencilAltIcon, TrashIcon} from '@heroicons/react/outline';
import {Form, Formik, Field} from 'formik'

export const GroupForm = () => {
    return(
        <div className='p-4'>
            <Formik>
                <Form>
                    <div className='space-y-2 flex flex-col'>
                        <label htmlFor="">Nombre</label>
                        <Field 
                            type='text' 
                            className='h-10 border rounded-md border-slate-400 pl-2'
                            placeholder = 'ej. Administradores'
                        />
                    </div>
                    <div className='flex justify-end mt-8'>
                        <button 
                            className=' bg-cyan-500 w-28 h-10 text-white p-1 rounded-md place-self-end font-bold' 
                            type='submit'
                        >
                        Guardar</button>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

const GroupList = ({items}) => {
    if(!items) return <></>
    const itemsList = items.map((item, index) => (
            <li key={index} className="flex w-full justify-between hover:bg-slate-200 rounded-md p-1 cursor-pointer">
                <span>{item.Nombre}</span>
                <div className='flex'>
                    <PencilAltIcon width={26}/>
                    <TrashIcon width={26}/>
                </div>
            </li>
    ));
    return itemsList;
}

const Groups = ({groups, handleModal}) => {
    return(
        <div className="flex-[1]">
            <div className="flex  items-start space-x-1">
                <div className="flex-1">
                    <span className=" block font-bold text-md bg-slate-300 rounded-md p-1 mb-1">Grupos</span>
                    <input
                        className=" bg-yellow-100 w-full rounded-md border-2 h-8"
                    />
                    <ul className="space-y-2 mt-3">
                        <GroupList items={groups}/>
                    </ul>
                </div>
                <PlusCircleIcon width={32} className="block cursor-pointer" onClick={()=> handleModal('groups', 'create')}/>
            </div>
        </div>
    )
}

export default Groups;
