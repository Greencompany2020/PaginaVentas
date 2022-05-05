import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";

const RegionesPlazaTableRow = ({ item, type }) => {
  const rowColor = (type) => {
    if (type === "plaza") return "bg-gray-300";
    else if (type === "region") return "bg-gray-400";
    return "";
  }

  return (
    <tr className={rowColor(type)}>
      <td className='text-center bg-black text-white font-bold'>
        {item.plaza}
      </td>
      <td>{numberWithCommas(item.compromiso)}</td>
      <td>{numberWithCommas(item.ventasActuales)}</td>
      {formatNumber(item.porcentaje)}
      <td>{numberWithCommas(item.ventasAnterior)}</td>
      <td>{numberWithCommas(item.operacionesComp)}</td>
      <td>{numberWithCommas(item.operacionesActual)}</td>
      {formatNumber(item.porcentajeOperaciones)}
      <td>{numberWithCommas(item.operacionesAnterior)}</td>
      <td>{numberWithCommas(item.promedioComp)}</td>
      <td>{numberWithCommas(item.promedioActual)}</td>
      {formatNumber(item.porcentajePromedios)}
      <td>{numberWithCommas(item.promedioAnterior)}</td>
      <td>{numberWithCommas(item.articulosActual)}</td>
      {formatNumber(item.articulosPorcentaje)}
      <td>{numberWithCommas(item.articulosAnterior)}</td>
    </tr>
  )
}

export default RegionesPlazaTableRow
