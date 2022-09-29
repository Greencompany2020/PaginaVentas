import React from 'react';
import { v4 } from 'uuid';
import { PencilIcon, UserGroupIcon, TrashIcon } from '@heroicons/react/outline';

export default function ClavesTable({items, handleEdit, editGroups, deleteClave}) {
    return (
        <table className={"table-politicas table-auto w-full mt-4 mb-4"}>
            <thead>
                <tr>
                    <th>Clave</th>
                    <th>Descripcion</th>
                    <th className="w-24">Opc</th>
                </tr>
            </thead>
            <tbody>
                {
                    items &&
                    items.map(item => (
                        <tr key={v4()}>
                            <td>{item.claves}</td>
                            <td>{item.descripcion}</td>
                            <td>
                                <div className="flex items-center space-x-2">
                                    <PencilIcon width={24} onClick={() => handleEdit(item)}/>
                                    <UserGroupIcon width={24} onClick={() => editGroups(item)}/>
                                    <TrashIcon width={24} onClick={() => deleteClave(item.id)}/>
                                </div>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

