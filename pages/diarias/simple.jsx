import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { SelectTiendas, SelectMonth, InputYear, InputContainer, Checkbox } from '@components/inputs';
import { tiendaSimpleVentas, checkboxLabels } from 'utils/data';

const simple = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectTiendas />
            <InputYear value={2022} onChange={() => { }} />
            <SelectMonth />
            <Checkbox className='mb-2' labelText={checkboxLabels.VENTAS_IVA} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Diarias M1 Ene 2022'>
        <VentasTable>
          <TableHead>
            <tr>
              <th colSpan={2} className='border border-white'>Dia</th>
              <th colSpan={3} className='border border-white'>Venta por Dia</th>
            </tr>
            <tr>
              <th className='border border-white'>22</th>
              <th className='border border-white'>21</th>
              <th className='border border-white'>2022</th>
              <th className='border border-white'>2021</th>
              <th className='border border-white'>Acum</th>
            </tr>
          </TableHead>
          <tbody className='bg-white text-right'>
            {
              tiendaSimpleVentas.map(ventas => (
                <tr key={ventas.fechaActual}>
                  <td>{ventas.fechaActual}</td>
                  <td>{ventas.fechaAnterior}</td>
                  <td>{ventas.ventaFechaActual}</td>
                  <td>{ventas.ventaFechaActual}</td>
                  <td>{ventas.fechaAcumulada}</td>
                </tr>
              ))
            }
          </tbody>
          <tfoot className='bg-black text-white text-center font-bold'>
            <tr>
              <th className='border border-white'>22</th>
              <th className='border border-white'>21</th>
              <th className='border border-white'>2022</th>
              <th className='border border-white'>2021</th>
              <th className='border border-white'>Acum</th>
            </tr>
            <tr>
              <th colSpan={2} className='border border-white'>Dia</th>
              <th colSpan={3} className='border border-white'>Venta por Dia</th>
            </tr>
          </tfoot>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default simple
