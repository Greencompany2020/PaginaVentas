import React from "react";
import { TrashIcon, PencilAltIcon } from "@heroicons/react/outline";

export default function GroupTable(props) {
  const { items, handleModalContent, handleDeleteGroup } = props;

  return (
    <div className="h-[500px] overflow-y-auto">
      <table className="min-w-full">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 p-1">Nombre</th>
            <th className="bg-slate-300  text-right rounded-r-md p-1">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.Id + index} className="cursor-pointer">
              <td>{item.Nombre}</td>
              <td className="flex justify-end space-x-1">
                <PencilAltIcon
                  width={32}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    handleModalContent("updateGroup", "Editar Grupo", item);
                  }}
                />
                <TrashIcon
                  width={32}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleDeleteGroup(item.Id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}