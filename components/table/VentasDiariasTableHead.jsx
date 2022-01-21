const VentasDiariasTableHead = () => {
  return (
    <thead className='bg-black text-white text-center'>
      <tr>
        <th colSpan={2} className='border border-white'>Dia</th>
        <th colSpan={4} className='border border-white'>Venta por Dia</th>
        <th colSpan={5} className='border border-white'>Acumulado Enero</th>
        <th colSpan={4} className='border border-white'>Acumulado Anual</th>
        <th className='border border-white'>Dia</th>
      </tr>
      <tr>
        <th className='border border-white'>22</th>
        <th className='border border-white'>21</th>
        <th className='border border-white'>2022</th>
        <th className='border border-white'>2021</th>
        <th className='border border-white'>COMP.</th>
        <th className='border border-white'>%</th>
        <th className='border border-white'>2022</th>
        <th className='border border-white'>2021</th>
        <th className='border border-white'>COMP.</th>
        <th className='border border-white'>(-)</th>
        <th className='border border-white'>%</th>
        <th className='border border-white'>2022</th>
        <th className='border border-white'>2021</th>
        <th className='border border-white'>COMP.</th>
        <th className='border border-white'>%</th>
        <th className='border border-white'>22</th>
      </tr>
    </thead>
  )
}

export default VentasDiariasTableHead
