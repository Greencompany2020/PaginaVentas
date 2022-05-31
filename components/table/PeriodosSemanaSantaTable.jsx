import { VentasTable } from ".";
import TableRow from "./TableRow";

const PeriodosSemanaSantaTable = ({ dates }) => {
  return (
    <>
      <VentasTable className="my-7 ">
        <thead className=" bg-black-shape text-white text-center">
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
              <td className="text-sm">{fecha.agno}</td>
              <td className="text-sm">{fecha.carnaval}</td>
              <td className="text-sm">{fecha.fechaInicio}</td>
              <td className="text-sm">{fecha.fechaFin}</td>
            </TableRow>
          ))}
        </tbody>
      </VentasTable>
    </>
  );
};

export default PeriodosSemanaSantaTable;
