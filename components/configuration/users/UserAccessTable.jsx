import generateKey from "../../paginate/generateKey";
import {PlusIcon, MinusIcon} from "@heroicons/react/outline";

export default function UserAccessTable(props) {
  const { items, assignAccessToUser } = props;
  return (
    <div className="h-[330px] md:h-[420px] overflow-y-auto">
      <table className="w-full">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 rounded-l-md  lg:table-cell">Proyecto</th>
            <th className="bg-slate-300 hidden lg:table-cell">
              Menu
            </th>
            <th className="bg-slate-300 p-1">Reporte</th>
            <th className="bg-slate-300 p-1 hidden  lg:table-cell">Nombre</th>
            <th className="bg-slate-300 text-center rounded-r-md p-1">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={generateKey(index)} className="cursor-pointer">
              <td className="py-1">{item.nombreProyecto}</td>
              <td className=" hidden lg:table-cell lg:py-1">{item.menu}</td>
              <td className="py-1">{item.reporte}</td>
              <td className=" hidden lg:table-cell lg:py-1">{item.nombreReporte}</td>
              <td className="flex justify-center space-x-1 py-1">
               <button
                 onClick={() =>  assignAccessToUser(item)}
                 className={`flex items-center border w-20 px-1 ${item.acceso ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500' }`}
               >
                 { item.acceso ?
                   <>
                     <MinusIcon width={19}/>
                     Quitar
                   </> :
                   <>
                     <PlusIcon width={19}/>
                     Asignar
                   </>
                 }
               </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

