import { useEffect, useState } from 'react';
import withAuth from '../../components/withAuth';
import { getBaseLayout } from '../../components/layout/BaseLayout';
import TabButton from '../../components/configuration/TabButton';
import ProyectTable from '../../components/configuration/proyects/ProyectTable';
import Paginate from '../../components/paginate';
import configuratorService from '../../services/configuratorService';
import { FormModal } from '../../components/modals';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import useToggle from '../../hooks/useToggle';
import Proyectform from '../../components/configuration/proyects/ProyectForm';


const Proyects = (props) => {
    const service = configuratorService();
    const [data, setData] = useState([]);
    const sendNotification = useNotification();
    const [showModal, setShowModal] = useToggle();
    const [selected, setSelected] = useState(null);

    const onPressAdd = () => {
        setSelected(null)
        setShowModal()
    }

    const onSelectItem = item => {
        setSelected(item);
        setShowModal()
    }

    const createNewProyect = async (values) => {
        try {
            await service.createProyect(values);
            const response = await service.getProyects();
            setData(response);
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error.response.data.message || error.message
            });
        }
    }

    const updateProyect = async(values) => {
        try {
            await service.updateProyect(selected.Id, values);
            const response = await service.getProyects();
            setData(response);
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error.response.data.message || error.message
            });
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await service.getProyects();
                setData(response);
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message: error.response.data.message || error.message
                });
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between h-fit p-4  bg-slate-50">
                <span className=" text-2xl font-semibold">Página de ventas</span>
                <span className=" text-3xl font-semibold">Configuración de Proyectos</span>
            </div>
            <div className='p-4'>
                <TabButton />
            </div>

            <section className=' overflow-hidden'>
                <div className='p-4 md:p-8 space-y-4'>
                    <div className="flex justify-start">
                        <button className="primary-btn w-20" onClick={onPressAdd}>Agregar</button>
                    </div>
                    <Paginate
                        data={data}
                        showItems={5}
                        options={{
                            labelSelector: "Mostrar",
                            optionRange: [20, 50, 100],
                            searchBy: ["Nombre"],
                        }}
                    >
                        <ProyectTable onSelectItem={onSelectItem}/>
                    </Paginate>
                </div>
            </section>

            <FormModal active={showModal} handleToggle={setShowModal} name={selected ? 'Editar Proyecto' : 'Agregar Proyecto'}>
                <Proyectform item={selected} handleToggle={setShowModal} onCreateNew = {createNewProyect} onUpdate={updateProyect}/>
            </FormModal>
        </>
    )
}

const WithAuthProyects = withAuth(Proyects);
WithAuthProyects.getLayout = getBaseLayout;
export default WithAuthProyects;