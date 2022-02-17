import { meses } from "../../utils/data";

const VentasDiariasTableHead = ({ currentYear, month }) => {
  const lastYear = currentYear - 1;

  const getMonth = (monthNumber) => {
    const monthObj = meses.find((mes) => mes.value === monthNumber);
    return monthObj?.text;
  }

  const getLastTwoNumbers = (date) => {
    return date?.toString().slice(2);
  }

  return (
    <thead className='bg-black text-white text-center'>
      <tr>
        <th colSpan={2} className='border border-white'>Dia</th>
        <th colSpan={4} className='border border-white'>Venta por Dia</th>
        <th colSpan={5} className='border border-white'>Acumulado {getMonth(month)}</th>
        <th colSpan={4} className='border border-white'>Acumulado Anual</th>
        <th className='border border-white'>Dia</th>
      </tr>
      <tr>
        <th className='border border-white'>{getLastTwoNumbers(currentYear)}</th>
        <th className='border border-white'>{getLastTwoNumbers(lastYear)}</th>
        <th className='border border-white'>{currentYear}</th>
        <th className='border border-white'>{lastYear}</th>
        <th className='border border-white'>COMP.</th>
        <th className='border border-white'>%</th>
        <th className='border border-white'>{currentYear}</th>
        <th className='border border-white'>{lastYear}</th>
        <th className='border border-white'>COMP.</th>
        <th className='border border-white'>(-)</th>
        <th className='border border-white'>%</th>
        <th className='border border-white'>{currentYear}</th>
        <th className='border border-white'>{lastYear}</th>
        <th className='border border-white'>COMP.</th>
        <th className='border border-white'>%</th>
        <th className='border border-white'>{getLastTwoNumbers(currentYear)}</th>
      </tr>
    </thead>
  )
}

export default VentasDiariasTableHead
