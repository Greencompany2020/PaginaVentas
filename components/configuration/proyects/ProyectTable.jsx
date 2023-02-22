import React from "react";
import { PencilAltIcon } from "@heroicons/react/outline";
import { v4 } from "uuid";

export default function ProyectTable(props) {
    const { items, onSelectItem } = props;

    return (
        <div className="h-[500px] overflow-y-auto">
            <table className="min-w-full">
                <thead className="text-left">
                    <tr>
                        <th className="bg-slate-300 p-1">Proyecto</th>
                        <th className="bg-slate-300  text-right rounded-r-md p-1">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <tr key={v4()} className="cursor-pointer" onClick={() => onSelectItem(item)}>
                            <td>{item.Nombre}</td>
                            <td className="flex justify-end space-x-1">
                                <PencilAltIcon
                                    width={26}
                                    className="cursor-pointer hover:text-blue-500"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}