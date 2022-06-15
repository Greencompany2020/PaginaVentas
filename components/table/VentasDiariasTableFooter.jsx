import { getMonthByNumber } from "../../utils/dateFunctions";
import { getLastTwoNumbers } from "../../utils/functions";

const VentasDiariasTableFooter = ({ currentYear, month }) => {
  const lastYear = currentYear - 1;

  return (
    <tfoot className=" text-white text-center text-xs font-bold">
      <tr className=" bg-black-shape text-right">
        <td className="border">{getLastTwoNumbers(currentYear)}</td>
        <td className="border">{getLastTwoNumbers(lastYear)}</td>
        <td className="border">{currentYear}</td>
        <td className="border">{lastYear}</td>
        <td className="border">COMP.</td>
        <td className="border">%</td>
        <td className="border">{currentYear}</td>
        <td className="border">{lastYear}</td>
        <td className="border">COMP.</td>
        <td className="border">(-)</td>
        <td className="border">%</td>
        <td className="border">{currentYear}</td>
        <td className="border">{lastYear}</td>
        <td className="border">COMP.</td>
        <td className="border">%</td>
        <td className="border">22</td>
      </tr>
      <tr>
        <td
          colSpan={2}
          className="border bg-black-shape rounded-bl-xl border-white"
        >
          Dia
        </td>
        <td colSpan={4} className="border bg-black-shape border-white">
          Venta por Dia
        </td>
        <td colSpan={5} className="border bg-black-shape border-white">
          Acumulado {getMonthByNumber(month)}
        </td>
        <td colSpan={4} className="border bg-black-shape border-white">
          Acumulado Anual
        </td>
        <td className="border bg-black-shape rounded-br-xl border-white">
          Dia
        </td>
      </tr>
    </tfoot>
  );
};

export default VentasDiariasTableFooter;
