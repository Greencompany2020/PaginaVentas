
const VentasDiariasTableFooter = () => {
  return (
    <tfoot className='bg-black text-white text-center font-bold'>
      <tr>
        <td className='border border-white'>22</td>
        <td className='border border-white'>21</td>
        <td className='border border-white'>2022</td>
        <td className='border border-white'>2021</td>
        <td className='border border-white'>COMP.</td>
        <td className='border border-white'>%</td>
        <td className='border border-white'>2022</td>
        <td className='border border-white'>2021</td>
        <td className='border border-white'>COMP.</td>
        <td className='border border-white'>(-)</td>
        <td className='border border-white'>%</td>
        <td className='border border-white'>2022</td>
        <td className='border border-white'>2021</td>
        <td className='border border-white'>COMP.</td>
        <td className='border border-white'>%</td>
        <td className='border border-white'>22</td>
      </tr>
      <tr>
        <td colSpan={2} className='border border-white'>Dia</td>
        <td colSpan={4} className='border border-white'>Venta por Dia</td>
        <td colSpan={5} className='border border-white'>Acumulado Enero</td>
        <td colSpan={4} className='border border-white'>Acumulado Anual</td>
        <td className='border border-white'>Dia</td>
      </tr>
    </tfoot>
  )
}

export default VentasDiariasTableFooter
