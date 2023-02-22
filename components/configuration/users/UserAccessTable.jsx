import TooggleSwitch from "../../inputs/TooggleSwitch";
import generateKey from "../../paginate/generateKey";

export default function UserAccessTable(props) {
  const { items, assignAccessToUser } = props;
  return (
    <div className="h-[330px] md:h-[420px] overflow-y-auto">
      <table className="w-full">
        <thead className="text-left">
          <tr>
            <th className="bg-slate-300 rounded-l-md   lg:table-cell">Proyecto</th>
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
              <td>{item.nombreProyecto}</td>
              <td className=" hidden lg:table-cell">{item.menu}</td>
              <td>{item.reporte}</td>
              <td className=" hidden lg:table-cell">{item.nombreReporte}</td>
              <td className="flex justify-center space-x-1">
                <TooggleSwitch
                  key={index}
                  id={item.idDashboard}
                  value={item.acceso}
                  onChange={() => assignAccessToUser(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

