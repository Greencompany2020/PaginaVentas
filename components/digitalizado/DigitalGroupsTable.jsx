import React from 'react';
import { v4 } from 'uuid';
import { PencilIcon, TrashIcon } from '@heroicons/react/outline';

export default function DigitalGroupsTable({ items, handleEdit, handleDelete }) {
    return (
        <table className="table-politicas table-fixed w-full mt-4 mb-4">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th className="w-16">OPC</th>
                </tr>
            </thead>
            <tbody>
                    {
                        items &&
                        items.map(item => (
                            <tr key={v4()}>
                                <td>{item.Nombre}</td>
                                <td>
                                    <div className="flex items-center space-x-2">
                                        <PencilIcon width={24} onClick={() => handleEdit(item)} />
                                        <TrashIcon width={24} onClick={() => handleDelete(item.Id)} />
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
        </table>
    )
}
