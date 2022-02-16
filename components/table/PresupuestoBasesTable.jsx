import { SemanaSantaTableFooter, VentasSemanaSantaHead, PresupuestoBasesTableHead, VentasTable } from ".";
import ventasDiariasGrupo from "../../utils/data/ventasDiariasGrupo";

const PresupuestoBasesTable = ({ year1, year2, title }) => {
  return (
    <>
      <h1 className="text-center font-bold">{title}</h1>
      <VentasTable className="my-7 ">
        <PresupuestoBasesTableHead year1={year1} year2={year2} />
        <tbody className="bg-white text-center">
        <tr>
          <th className="border border-white"></th>
         
        </tr>
        </tbody>
        
      </VentasTable>
    </>
  );
};

export default PresupuestoBasesTable;
