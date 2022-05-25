import { VentasSemanaSantaHead, VentasTable } from ".";
import { getDayName, validateDate } from "../../utils/functions";
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated'
import TableRow from "./TableRow";

const SemanaSantaTable = ({ year1, year2, title, ventas = [] }) => {
  return (
    <>
      <h1 className="text-center font-bold">{validateDate(title) ? getDayName(title) : title }</h1>
      <VentasTable className="my-7 last-row-bg">
        <VentasSemanaSantaHead year1={year1} year2={year2} />
        <tbody className="bg-white text-center">
          {ventas?.map((venta) => (
            <TableRow key={venta?.dia ?? venta?.plaza} rowId={venta?.dia ?? venta?.plaza}>
              <td className="text-center">{getDayName(venta?.dia) ?? venta?.plaza}</td>
              <td className="text-center">{numberWithCommas(venta.ventaActual)}</td>
              <td className="text-center">{numberWithCommas(venta.ventaAnterior)}</td>
              {formatNumber(venta.crecimiento)}
            </TableRow>
          ))}
        </tbody>
      </VentasTable>
    </>
  );
};

export default SemanaSantaTable;
