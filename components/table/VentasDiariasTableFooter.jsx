import { getLastTwoNumbers, getMonth } from "../../utils/functions";

const VentasDiariasTableFooter = ({ currentYear, month }) => {
  const lastYear = currentYear - 1;

  return (
    <tfoot className='bg-black text-white text-center font-bold'>
      <tr>
        <td className='border border-white'>{getLastTwoNumbers(currentYear)}</td>
        <td className='border border-white'>{getLastTwoNumbers(lastYear)}</td>
        <td className='border border-white'>{currentYear}</td>
        <td className='border border-white'>{lastYear}</td>
        <td className='border border-white'>COMP.</td>
        <td className='border border-white'>%</td>
        <td className='border border-white'>{currentYear}</td>
        <td className='border border-white'>{lastYear}</td>
        <td className='border border-white'>COMP.</td>
        <td className='border border-white'>(-)</td>
        <td className='border border-white'>%</td>
        <td className='border border-white'>{currentYear}</td>
        <td className='border border-white'>{lastYear}</td>
        <td className='border border-white'>COMP.</td>
        <td className='border border-white'>%</td>
        <td className='border border-white'>22</td>
      </tr>
      <tr>
        <td colSpan={2} className='border border-white'>Dia</td>
        <td colSpan={4} className='border border-white'>Venta por Dia</td>
        <td colSpan={5} className='border border-white'>Acumulado {getMonth(month)}</td>
        <td colSpan={4} className='border border-white'>Acumulado Anual</td>
        <td className='border border-white'>Dia</td>
      </tr>
    </tfoot>
  )
}

export default VentasDiariasTableFooter
