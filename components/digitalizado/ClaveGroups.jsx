import React, { useState, useEffect } from 'react';
import Paginate from '../paginate';
import digitalizadoService from '../../services/digitalizadoService';
import { useNotification } from '../notifications/NotificationsProvider';
import { v4 } from 'uuid';

export default function ClaveGroups({ id ,handleToggle}) {
    const service = digitalizadoService();
    const sendNotification = useNotification();
    const [data, setData] = useState(null);

    const formatDataToGroups = data => {
        const formated = []
        const { grupos, asignados } = data;
        grupos.forEach(grupo => {
            const claveGroup = asignados.find(item => item.idGrupo === grupo.idGrupo);
            const inGroup = claveGroup ? true : false;
            const idGrupoClave = inGroup ?  claveGroup?.idGruposClave : null;
            formated.push({ ...grupo, inGroup, idGrupoClave})
        });
        return formated;
    }

    const getInitialData = async () => {
        try {
            const response = await service.getClavesGrupo(id);
            setData(formatDataToGroups(response))
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.result?.message || error.message,
            });
        }
    }

    const handleAddGroupToClave = async idGrupo => {
        try {
            const body = { idClave: id, idGrupo }
            await service.addGroupToClave(body);
            await getInitialData();
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.result?.message || error.message,
            });
        }
    }

    const handleDeleteGroupFromClave = async idGrupo => {
        try {
            await service.deleteGroupFromClave(idGrupo);
            await getInitialData();
        } catch (error) {
            sendNotification({
                type: 'ERROR',
                message: error?.result?.message || error.message,
            });
        }
    }

    const handleChange = async (e, idGrupo, idGrupoClave) => {
        const { value } = e.target;
        if (value == "false") await handleAddGroupToClave(idGrupo);
        else handleDeleteGroupFromClave(idGrupoClave);
    }

    useEffect(() => {
        (async () => {
            if (id) await getInitialData();
        })()
    }, [id])


    return (
        <div className="flex flex-col md:w-[50rem] md:h-[40rem] p-2 overflow-auto">
            <div className="h-[90%]  overflow-y-auto">
                <Paginate
                    data={data}
                    showItems={5}
                    options={{
                        labelSelector: "Mostrar",
                        optionRange: [20, 50, 100],
                        searchBy: ["menu", "reporte", "nombreReporte"],
                    }}>
                    <Table handleChange={handleChange} />
                </Paginate>
            </div>
            <div className="flex items-center justify-end h-[10%]">
                <button className="secondary-btn w-24" onClick={handleToggle}>Salir</button>
            </div>
        </div>
    )
}


function Table({ items, handleChange }) {
    return (
        <table className={"table-politicas table-auto"}>
            <thead>
                <tr>
                    <th>Clave</th>
                    <th className="w-12">Opc</th>
                </tr>
            </thead>
            <tbody>
                {
                    items &&
                    items.map(item => {
                        return (
                            <tr key={v4()}>
                                <td>{item.nombre}</td>
                                <td>
                                    <div className='flex justify-center'>
                                        <input
                                            type='checkbox'
                                            value={item.inGroup}
                                            checked={item.inGroup}
                                            onChange={(e) => handleChange(e, item.idGrupo, item.idGrupoClave)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}