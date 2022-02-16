import { SemanaSantaTableFooter, VentasSemanaSantaHead, VentasTable } from ".";
import ventasDiariasGrupo from "../../utils/data/ventasDiariasGrupo";

const SemanaSantaTable = ({ year1, year2, title }) => {
  return (
    <>
      <h1 className="text-center font-bold">{title}</h1>
      <VentasTable className="my-7 ">
        <VentasSemanaSantaHead year1={year1} year2={year2} />
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
        <SemanaSantaTableFooter />
      </VentasTable>
    </>
  );
};

export default SemanaSantaTable;
