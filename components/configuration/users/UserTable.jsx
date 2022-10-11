import React from "react";
import {
  TrashIcon,
  PencilAltIcon,
  LockOpenIcon,
} from "@heroicons/react/outline";
import {v4} from 'uuid'

export default function UserTable(props) {
  const {items,handleSelect,handleShowModal, handleShowAccess, deleteUser} = props;
  return (
    <div className="h-[400px] md:h-[400px] overflow-y-auto">
      <table className="min-w-full table-fixed">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 rounded-l-md">No.Empledo</th>
            <th className="bg-slate-300 p-1">Nombre</th>
            <th className="bg-slate-300 p-1 hidden  lg:table-cell">
              Apellidos
            </th>
            <th className="bg-slate-300 p-1  hidden  lg:table-cell">Usuario</th>
            <th className="bg-slate-300 p-1 hidden  lg:table-cell">Grupo</th>
            <th className="bg-slate-300 p-1 hidden  lg:table-cell">Rol</th>
            <th className="bg-slate-300 text-center rounded-r-md p-1">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr
              key={v4()}
              className="cursor-pointer"
              onClick={() => handleSelect(item)}
            >
              <td>{item.NoEmpleado}</td>
              <td>{item.Nombre}</td>
              <td className="hidden lg:table-cell">{item.Apellidos}</td>
              <td className="hidden lg:table-cell">{item.UserCode}</td>
              <td className="hidden lg:table-cell">{item.NombreGrupo}</td>
              <td className="hidden lg:table-cell">{(item.Rol !== null) ? item.Rol : 'Sin rol'}</td>
              <td className="flex justify-center space-x-1">
                <LockOpenIcon
                  width={26}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={handleShowAccess}
                />
                <PencilAltIcon
                  width={26}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={handleShowModal}
                />
                <TrashIcon
                  width={26}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => deleteUser(item.Id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

