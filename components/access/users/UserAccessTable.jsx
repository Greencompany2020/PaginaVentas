import TooggleSwitch from "../../inputs/TooggleSwitch";
import generateKey from "../../paginate/generateKey";

export default function UserAccessTable(props) {
  const { items, handleAssignAccess } = props;
  return (
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
          <tr key={generateKey(index)} className="cursor-pointer">
            <td className=" hidden lg:table-cell">{item.menu}</td>
            <td className=" hidden lg:table-cell">{item.reporte}</td>
            <td>{item.nombreReporte}</td>
            <td className="flex justify-center space-x-1">
              <TooggleSwitch
                key={index}
                id={item.idDashboard}
                value={item.acceso}
                onChange={() =>
                  handleAssignAccess(item.idDashboard, item.acceso)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

