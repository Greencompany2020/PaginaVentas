import PresupuestoFechaHead from "./PresupuestoFechasTableHead";
import { numberWithCommas } from "../../utils/resultsFormated";
import VentasTable from "./VentasTable";

const PresupuestoTable = ({ title, presupuestos = [] }) => {
  return (
    <>
      <h1 className="text-center font-bold">{title}</h1>
      <VentasTable className="my-7 last-row-bg">
      <PresupuestoFechaHead />
        <tbody className="bg-white text-center">
          {presupuestos?.map((item, index) => (
            <tr key={index}>
              <td className="text-center">{item.SFecha ?? item.Descrip}</td>
              <td className="text-center">{numberWithCommas(item.Presupuesto)}</td>
              <td className="text-center">{numberWithCommas(item.Operaciones)}</td>
              <td>{item.SFecha ? numberWithCommas(item.Promedios) : "-"}</td>
              <td>{numberWithCommas(item.ImporteB)}</td>
              <td>{numberWithCommas(item.ImporteC)}</td>
            </tr>
          ))}
        </tbody>
      </VentasTable>
    </>
  );
};

export default PresupuestoTable;
