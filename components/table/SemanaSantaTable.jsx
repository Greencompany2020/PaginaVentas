import { VentasSemanaSantaHead, VentasTable } from ".";
import { getDayName, validateDate } from "../../utils/functions";
import { formatNumber, numberWithCommas} from "../../utils/resultsFormated";
import TableRow from "./TableRow";

const SemanaSantaTable = ({ year1, year2, title, ventas = [] }) => {
  const count = ventas.length;
  return (
    <>
      <h1 className="text-center font-bold ">
        {validateDate(title) ? getDayName(title) : title}
      </h1>
      <VentasTable className="my-7 tfooter">
        <VentasSemanaSantaHead year1={year1} year2={year2} />
        <tbody className="bg-white text-center">
          {ventas?.map((venta, index) => (
            <TableRow
              key={venta?.dia ?? venta?.plaza}
              rowId={venta?.dia ?? venta?.plaza}
              className="text-xs text-right"
            >
              <td className="text-left">
                {getDayName(venta?.dia) ?? venta?.plaza}
              </td>
              <td>{numberWithCommas(venta.ventaActual)}</td>
              <td>{numberWithCommas(venta.ventaAnterior)}</td>
              {formatNumber(venta.crecimiento, index == count-1)}
            </TableRow>
          ))}
        </tbody>
      </VentasTable>
    </>
  );
};

export default SemanaSantaTable;
