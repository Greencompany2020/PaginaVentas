import { TrashIcon, PencilAltIcon, AdjustmentsIcon } from "@heroicons/react/outline";
import { generateLivKey } from "../../../utils/functions";
import { v4 } from "uuid";

export default function TableAccess(props) {
  const { items, handleSelect, handleShowModal, deleteAccess, handleShowRetrive} = props;
  return (
    <div className="h-[500px] w-full overflow-auto">
      <table className="w-full overflow-auto">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 rounded-l-md hidden  lg:table-cell">
              Menu
            </th>
            <th className="bg-slate-300 p-1 hidden  lg:table-cell">Reporte</th>
            <th className="bg-slate-300 p-1 rounded-l-md lg:rounded-none">Nombre</th>
            <th className="bg-slate-300 text-center rounded-r-md p-1">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={v4()} className="cursor-pointer" onClick={()=>handleSelect(item)}>
              <td className=" hidden lg:table-cell">{item.menu}</td>
              <td className=" hidden lg:table-cell">{item.reporte}</td>
              <td>{item.nombreReporte}</td>
              <td className="flex justify-center space-x-1">
                <PencilAltIcon
                  width={26}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={handleShowModal}
                />
                 <AdjustmentsIcon
                  width={26}
                  className="curos-pointer hover:text-blue-500"
                  onClick={handleShowRetrive}
                />
                <TrashIcon
                  width={26}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => deleteAccess(item.idDashboard)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

