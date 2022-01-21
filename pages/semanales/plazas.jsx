import Link from 'next/link'
import { SmallContainer, ParametersContainer, Parameters } from '@components/containers';
import { InputContainer, InputDateRange, Checkbox } from '@components/inputs'
import VentasLayout from '@components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { semanalesPlaza, checkboxLabels } from 'utils/data'


const Informes = () => {

  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputDateRange />
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este informe muestra un compartivo de la semana o en rango de fecha selecionado. Recuerde que la comparacions se realiza lunes contra lunes,
        </SmallContainer>
        <SmallContainer>
          lo cual quiere decir que las ventas del año anterior no seran por fecha sino lo que corresponda a los dias de la semana.
        </SmallContainer>
      </ParametersContainer>

      {/* Table */}
      <VentasTableContainer title='Detalles de información / Semanales por plaza'>
        <VentasTable className='tfooter'>
          <TableHead>
            <tr>
              <td rowSpan={3} className='border border-white'>Plaza</td>
              <td colSpan={12} className='border border-white'>Del 20 de dic al 26 de Dic 2021</td>
            </tr>
            <tr>
              <td rowSpan={2} className='border border-white'>Comp</td>
              <td rowSpan={2} className='border border-white'>2021</td>
              <td rowSpan={2} className='border border-white'>%</td>
              <td rowSpan={2} className='border border-white'>2020</td>
              <td colSpan={4} className='border border-white'>operaciones</td>
              <td colSpan={4} className='border border-white'>promedios</td>
            </tr>
            <tr>
              <td className='border border-white'>Comp</td>
              <td className='border border-white'>2021</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>2020</td>
              <td className='border border-white'>comp</td>
              <td className='border border-white'>2021</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>2020</td>
            </tr>
          </TableHead>
          <tbody className='bg-white'>
            {
              semanalesPlaza.map(item => (
                <tr className='text-right' key={item.plaza}>
                  <td className='text-left bg-black text-white underline font-bold'>
                    <Link href='/informes'><a>{item.plaza}</a></Link>
                  </td>
                  <td>{item.comp}</td>
                  <td>{item.fechaActual}</td>
                  <td className='text-red-600 font-bold'>{item.porcentaje}</td>
                  <td>{item.fechaComp}</td>
                  <td>{item.operacionesComp}</td>
                  <td>{item.opeFechaActual}</td>
                  <td className='text-red-600 font-bold'>{item.porcentajeOper}</td>
                  <td>{item.opeFechaComp}</td>
                  <td>{item.promedioComp}</td>
                  <td>{item.promFechaActual}</td>
                  <td className='text-red-600 font-bold'>{item.porcentajeProm}</td>
                  <td>{item.promFechaComp}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default Informes
