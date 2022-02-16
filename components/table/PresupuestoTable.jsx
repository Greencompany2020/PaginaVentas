import { PresupuestoFechasFooter, PresupuestoFechaHead, VentasTable } from ".";
import ventasDiariasGrupo from "../../utils/data/ventasDiariasGrupo";

const PresupuestoTable = ({ year1, year2, title }) => {
  return (
    <>
      <h1 className="text-center font-bold">{title}</h1>
      <VentasTable className="my-7 ">
      <PresupuestoFechaHead/>
        <tbody className="bg-white text-center">
          {ventasDiariasGrupo.map((item) => (
            <tr key={item.fechaActual}>
              <td className="text-center">{item.fechaActual}</td>
              <td className="text-center">{item.fechaAnterior}</td>
              <td>{item.ventaDiariaFechaActual}</td>
              <td>{item.ventaDiariaFechaAnterior}</td>
            </tr>
          ))}
        </tbody>
        <PresupuestoFechasFooter />
      </VentasTable>
    </>
  );
};

export default PresupuestoTable;
