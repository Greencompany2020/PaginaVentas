import React,{useState, useEffect, useRef} from 'react';
import { getBaseLayout } from '../../components/layout/BaseLayout';
import configuratorService from '../../services/configuratorService';
import { useNotification } from '../../components/notifications/NotificationsProvider';
import Paginate from '../../components/paginate';
import TableAccess from '../../components/configuration/access/TableAccess';
import { FormModal } from '../../components/modals';
import useToggle from '../../hooks/useToggle';
import AccessForm from '../../components//configuration/access/AccessForm';
import {ConfirmModal} from '../../components/modals';
import ParameterForm from '../../components/ParameterForm';
import withAuth from '../../components/withAuth';
import TabButton from '../../components/configuration/TabButton';


const Access = (props) => {
    const [access, setAccess] = useState([]);
    const [proyects, setProyects] = useState([]);
    const [selectedAccess, setSelectedAccess] = useState({
        data:undefined,
        parameters:undefined,
    });
    const service = configuratorService();
    const sendNotification = useNotification();
    const [showModal, setShowModal] = useToggle();
    const [showRetrive, setShowRetrive] = useToggle();
    const confirmModalRef = useRef(null);

    const handleSelect = async item => {
        try {
            const response = await service.getParameters(item?.idDashboard);
            setSelectedAccess({
                data: item,
                parameters: response,
            })
        } catch (error) {
            
        }
    }

    const handleAddButton = () =>{
        setSelectedAccess({data: undefined, parameters:undefined});
        setShowModal();
    }

    const addNewAccess = async values =>{
        try {
            await service.createAccess(values);
            const response = await service.getAccess();
            setAccess(response) 
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message: error.response.data.message || error.message
            });
        }
    }

    const updateAccess = async (id, values) => {
        try {
            await service.updateAccess(id, values);
            const response = await service.getAccess();
            setAccess(response) 
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message: error.response.data.message || error.message
            });
        }
    }

    const setParameters = async values => {
        try {
            const idDashboard = selectedAccess.data.idDashboard;
            await service.configureParameters(idDashboard, values);
            setShowRetrive();
        } catch (error) {
            sendNotification({
                type:'ERROR',
                message: error.response.data.message || error.message
            });
        }
    }

    const deleteAccess = async id => {
        const confirm = await confirmModalRef.current.show();
        if(confirm){
            try {
                await service.deleteAccess(id);
                const response = await service.getAccess();
                setAccess(response);
                setSelectedAccess({data: undefined, parameters:undefined});
            } catch (error) {
                sendNotification({
                    type:'ERROR',
                    message: error.response.data.message || error.message
                });
            }
        }
    }

    useEffect(()=>{
        (async ()=>{
            try {
               const response = await service.getAccess();
               const responseProyects = await service.getProyects();
               setAccess(response);
               setProyects(responseProyects)
            } catch (error) {
                sendNotification({
                    type:'ERROR',
                    message: error.response.data.message || error.message
                });
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between h-fit p-4  bg-slate-50">
                <span className=" text-2xl font-semibold">Página de ventas</span>
                <span className=" text-3xl font-semibold">Configuración de Accesos</span>
            </div>
            <div className='p-4'>
                <TabButton/>
            </div>
            <section className=' overflow-hidden'>
                <div className='p-4 md:p-8 space-y-4'>
                    <div className="flex justify-start">
                        <button className="primary-btn w-20" onClick={handleAddButton}>Agregar</button>
                    </div>
                    <Paginate
                        data={access}
                        showItems={5}
                        options={{
                        labelSelector: "Mostrar",
                        optionRange: [20, 50, 100],
                        searchBy: ["menu", "reporte", "nombreReporte"],
                        }}
                    >
                        <TableAccess
                            handleSelect = {handleSelect}
                            handleShowModal = {setShowModal}
                            deleteAccess = {deleteAccess}
                            handleShowRetrive ={setShowRetrive}
                        />
                    </Paginate>
                </div>
            </section>
            {/* MODALS*/}
            <FormModal key={1} active={showModal} handleToggle={setShowModal} name={selectedAccess.data ? 'Editar acceso' : 'Agregar acceso'}>
                <AccessForm 
                    item={selectedAccess.data}
                    addNewAccess = {addNewAccess}
                    updateAccess = {updateAccess}
                    handleModal =  {setShowModal}
                    proyects = {proyects}
                />
            </FormModal>
            <FormModal key={2} active={showRetrive} handleToggle={setShowRetrive} name='Editar parametros'>
                <ParameterForm savedParameters={selectedAccess.parameters} submit={setParameters} onlySelect={false}/>
            </FormModal>
            <ConfirmModal ref={confirmModalRef}/>
        </>
    )
}

const WithAuthAccess = withAuth(Access);
WithAuthAccess.getLayout = getBaseLayout;
export default WithAuthAccess;
