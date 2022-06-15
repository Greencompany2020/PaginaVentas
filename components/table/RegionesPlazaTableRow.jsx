import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";
import TableRow from "./TableRow";

const RegionesPlazaTableRow = ({ item, type, rowId , isLast}) => {
  const rowColor = (type) => {
    if (type === "plaza") return "bg-gray-300";
    else if (type === "region") return "bg-gray-400";
    return "";
  };

  return (
    <TableRow className={rowColor(type)} rowId={rowId}>
      <td className="text-center bg-black-shape text-white font-bold">
        {item.plaza}
      </td>
      <td>{numberWithCommas(item.compromiso)}</td>
      <td className="font-bold">{numberWithCommas(item.ventasActuales)}</td>
      {formatNumber(item.porcentaje, isLast)}
      <td>{numberWithCommas(item.ventasAnterior)}</td>
      <td className="font-bold">{numberWithCommas(item.operacionesComp)}</td>
      <td className="font-bold">{numberWithCommas(item.operacionesActual)}</td>
      {formatNumber(item.porcentajeOperaciones, isLast)}
      <td>{numberWithCommas(item.operacionesAnterior)}</td>
      <td className="font-bold">{numberWithCommas(item.promedioComp)}</td>
      <td className="font-bold">{numberWithCommas(item.promedioActual)}</td>
      {formatNumber(item.porcentajePromedios, isLast)}
      <td>{numberWithCommas(item.promedioAnterior)}</td>
      <td className="font-bold">{numberWithCommas(item.articulosActual)}</td>
      {formatNumber(item.articulosPorcentaje, isLast)}
      <td>{numberWithCommas(item.articulosAnterior, isLast)}</td>
    </TableRow>
  );
};

export default RegionesPlazaTableRow;
