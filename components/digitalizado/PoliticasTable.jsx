import React from 'react';
import { PencilIcon, SearchIcon, CollectionIcon } from '@heroicons/react/outline';
import { useState } from 'react';

export default function PoliticasTable({
    items,
    handleSelectedItem,
    handleSetVarious,
    handleSetContents,
    handleUpdateContainer,
    isAdmin,
    handleOpeLast,
    seeHistory
}) {

    const isSeeHistory = clave => {
        if(seeHistory){
            const isClave = seeHistory.find(item => item === clave);
            return isClave ? true : false;
        }
        return false;
    }
    

    return (
        <table className={"table-politicas w-full mt-4 mb-4"}>
            <thead>
                <tr>
                    <th></th>
                    <th>Clave</th>
                    <th>Descripcion</th>
                    <th className='hidden md:table-cell'>F.Autorizacion</th>
                    <th className='hidden md:table-cell'>F.Vigencia</th>
                    <th className='hidden md:table-cell'>F.Carga</th>
                    <th className='hidden md:table-cell'>Empresa</th>
                    <th className="w-16">Opc</th>
                </tr>
            </thead>
            <tbody>
                {
                    items &&
                    items.map((item, index) => (
                        <tr key={index + item.clave}>
                            <td>
                                <CheckTable
                                    item={item.idArchivo}
                                    id={item.id}
                                    handleSetVarious={handleSetVarious}
                                    handleSetContents={handleSetContents}
                                />
                            </td>
                            <td>{item.clave}</td>
                            <td>{item.descripcion}</td>
                            <td className='hidden md:table-cell'>{item.fechaAutorizacion}</td>
                            <td className='hidden md:table-cell'>{item.fechaVigencia}</td>
                            <td className='hidden md:table-cell'>{item.fechaCarga}</td>
                            <td className='hidden md:table-cell'>{item.empresa}</td>
                            <td>
                                <div className='flex items-center space-x-2'>
                                    {isAdmin && <PencilIcon width={24} onClick={() => handleUpdateContainer(item)} />}
                                    <SearchIcon width={24} onClick={() => handleOpeLast(item.idArchivo)} />
                                    {(isAdmin || isSeeHistory(item?.clavePolitica)) && <CollectionIcon width={24} onClick={() => handleSelectedItem(item)} />}
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

const CheckTable = ({ item, handleSetVarious, handleSetContents, id }) => {
    const [sel, setSel] = useState(false);
    const handleChange = e => {
        setSel(!sel);
        handleSetVarious(item);
        handleSetContents(id);
    }
    return <input type={"checkbox"} onChange={handleChange} value={sel} checked={sel} />
}

