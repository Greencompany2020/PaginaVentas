import React, { useState, useEffect } from 'react';
import Avatar from '../components/commons/Avatar';
import { useSelector } from 'react-redux';
import { getBaseLayout } from "../components/layout/BaseLayout";
import withAuth from '../components/withAuth';
import { CogIcon } from '@heroicons/react/outline';
import Paginate from '../components/paginate';
import digitalizadoService from '../services/digitalizadoService';
import { useNotification } from '../components/notifications/NotificationsProvider';
import PoliticasTable from '../components/digitalizado/PoliticasTable';

const Digitalizado = () => {
    const { user } = useSelector(state => state);
    const [data, setData] = useState(null);
    const [userGroups, setUserGroups] = useState(null);
    const service = digitalizadoService();
    const sendNotification = useNotification();

    useEffect(() => {
        (async () => {
            try {
                const responseUserGroups = await service.getUserClave();
                setUserGroups(responseUserGroups);
                const responsePoliticas = await service.getPoliticas();
                setData(responsePoliticas);
            } catch (error) {
                sendNotification({
                    type: 'ERROR',
                    message: error?.response?.message || error.message
                })
            }
        })()
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="relative flex flex-col md:flex-row h-full">
            <section className={"bg-black-light h-24 order-2  md:order-1 md:w-14 md:h-full "}>
                <div className=' flex w-full h-full items-center md:justify-center'>
                    <CogIcon width={32} className='text-white md:self-end' />
                </div>
            </section>

            <section className='w-full h-[500px] md:w-[300px] md:h-full md:order-2 bg-gray-200 '>
                <div className='p-4'>
                    <div className="flex flex-col items-center md:justify-center space-y-2">
                        <figure className='w-[12rem] h-[12rem]'>
                            <Avatar image={user.ImgPerfil} />
                        </figure>
                    </div>
                    <div className='mt-8'>
                        <dl>
                            <dt className="font-semibold">Colaborador</dt>
                            <dd className="mb-2">{user.Nombre} {user.Apellidos}</dd>
                            <dt className="font-semibold">Usuario</dt>
                            <dd className="mb-2">{user.UserCode}</dd>
                            <dt className="font-semibold">Email</dt>
                            <dd className="mb-2">{user.Email}</dd>
                            <dt className="font-semibold">Grupo</dt>
                            <dd className='mb-2'>{user.NombreGrupo}</dd>
                            <dt className="font-semibold">Claves autorizadas</dt>
                            <dd className="truncate">
                                {
                                    userGroups &&
                                    userGroups?.claves.map(item=>(item.claves))
                                }
                            </dd>
                        </dl>
                    </div>
                </div>
            </section>
            <section className='order-3 h-full w-full overflow-auto'>
                <div className="p-4">
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-2">Politicas y procedimientos</h3>
                        <p>
                            Listado de politicas y procedimientos de The Green Company,
                            disponibles para tu usuario, segun perfi. si no encuentras alguna
                            politica o procedimiento favor de informar a DH
                        </p>
                    </div>

                    <div>
                        <Paginate
                            data={data?.politicas}
                            showItems={5}
                            options={{
                                labelSelector: "Mostrar",
                                optionRange: [20, 50, 100],
                                searchBy: ["menu", "reporte", "nombreReporte"],
                            }}
                        >
                           <PoliticasTable  />
                        </Paginate>
                    </div>
                </div>
            </section>
        </div>
    )
}
const DigitalizadoWithAuth = withAuth(Digitalizado);
DigitalizadoWithAuth.getLayout = getBaseLayout;
export default DigitalizadoWithAuth;