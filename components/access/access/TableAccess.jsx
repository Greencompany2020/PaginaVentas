import { TrashIcon, PencilAltIcon } from "@heroicons/react/outline";
import { generateLivKey } from "../../../utils/functions";

export default function TableAccess(props) {
  const { items, handleModalContent, handleDeleteAccess } = props;
  return (
    <div className="h-[500px] overflow-y-auto">
      <table className="w-full">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 rounded-l-md hidden  lg:table-cell">
              Menu
            </th>
            <th className="bg-slate-300 p-1 hidden  lg:table-cell">Reporte</th>
            <th className="bg-slate-300 p-1">Nombre</th>
            <th className="bg-slate-300 text-center rounded-r-md p-1">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={generateLivKey(index)} className="cursor-pointer">
              <td className=" hidden lg:table-cell">{item.menu}</td>
              <td className=" hidden lg:table-cell">{item.reporte}</td>
              <td>{item.nombreReporte}</td>
              <td className="flex justify-center space-x-1">
                <PencilAltIcon
                  width={32}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => {
                    handleModalContent("updateAccess", "Editar acceso", item);
                  }}
                />
                <TrashIcon
                  width={32}
                  className="cursor-pointer hover:text-blue-500"
                  onClick={() => handleDeleteAccess(item.idDashboard)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

