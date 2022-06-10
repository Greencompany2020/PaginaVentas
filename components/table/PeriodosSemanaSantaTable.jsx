import { VentasTable } from ".";
import TableRow from "./TableRow";

const PeriodosSemanaSantaTable = ({ dates }) => {
  return (
    <>
      <VentasTable className="my-7 ">
        <thead className=" text-white text-center text-xs table-head table-head-rl table-head-rr">
          <tr>
            <th className="border border-white">Año</th>
            <th className="border border-white">Carnaval</th>
            <th className="border border-white">Inicio</th>
            <th className="border border-white">Fin</th>
          </tr>
        </thead>
        <tbody className="bg-white text-center">
          {dates?.map((fecha) => (
            <TableRow
              key={fecha.agno}
              rowId={fecha.agno}
              className={
                fecha.agno === new Date().getFullYear() ? "font-bold" : ""
              }
            >
              <td className="text-xs text-right">{fecha.agno}</td>
              <td className="text-xs text-left pl-3">{fecha.carnaval}</td>
              <td className="text-xs text-left">{fecha.fechaInicio}</td>
              <td className="text-xs text-left">{fecha.fechaFin}</td>
            </TableRow>
          ))}
        </tbody>
      </VentasTable>
    </>
  );
};

export default PeriodosSemanaSantaTable;
