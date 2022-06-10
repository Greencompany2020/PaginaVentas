import { getMonthByNumber } from "../../utils/dateFunctions";
import { getLastTwoNumbers } from "../../utils/functions";

const VentasDiariasTableHead = ({ currentYear, month }) => {
  const lastYear = currentYear - 1;

  return (
    <thead className=" text-white text-center text-xs  rounded-md">
      <tr>
        <th
          colSpan={2}
          className="border bg-black-shape rounded-tl-xl border-white"
        >
          Dia
        </th>
        <th colSpan={4} className="border bg-black-shape border-white">
          Venta por Dia
        </th>
        <th colSpan={5} className="border bg-black-shape border-white">
          Acumulado {getMonthByNumber(month)}
        </th>
        <th colSpan={4} className="border bg-black-shape border-white">
          Acumulado Anual
        </th>
        <th className="border bg-black-shape rounded-tr-xl border-white">
          Dia
        </th>
      </tr>
      <tr className="bg-black-shape">
        <th className="border border-white">
          {getLastTwoNumbers(currentYear)}
        </th>
        <th className="border border-white">{getLastTwoNumbers(lastYear)}</th>
        <th className="border border-white">{currentYear}</th>
        <th className="border border-white">{lastYear}</th>
        <th className="border border-white">COMP.</th>
        <th className="border border-white">%</th>
        <th className="border border-white">{currentYear}</th>
        <th className="border border-white">{lastYear}</th>
        <th className="border border-white">COMP.</th>
        <th className="border border-white">(-)</th>
        <th className="border border-white">%</th>
        <th className="border border-white">{currentYear}</th>
        <th className="border border-white">{lastYear}</th>
        <th className="border border-white">COMP.</th>
        <th className="border border-white">%</th>
        <th className="border border-white">
          {getLastTwoNumbers(currentYear)}
        </th>
      </tr>
    </thead>
  );
};

export default VentasDiariasTableHead;
