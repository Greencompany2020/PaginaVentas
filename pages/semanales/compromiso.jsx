import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, InputDateRange, SelectPlazas, Checkbox } from '@components/inputs';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { compromisosSemanales, checkboxLabels } from 'utils/data';

const compromiso = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas classLabel='xl:text-center' />
          </InputContainer>

          <InputDateRange />

          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este informe muestra un compartivo de la semana o en rango de fecha selecionado. Recuerde que la comparaciones se realiza lunes contra lunes,
        </SmallContainer>
        <SmallContainer>
          lo cual quiere decir que las ventas del año anterior no seran por fecha sino lo que corresponda a los dias de la semana.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='DEFINICION METAS: Semana del 03 de Ene Al 09 de Ene 2022'>
        <VentasTable>
          <TableHead>
            <tr>
              <th rowSpan={2} className='border border-white'>Tienda</th>
              <th colSpan={2} className='border border-white'>Venta</th>
              <th colSpan={2} className='border border-white'>Promedios</th>
              <th colSpan={2} className='border border-white'>Operaciones</th>
            </tr>
            <tr>
              <th colSpan={2} className='border border-white'>Compromiso</th>
              <th colSpan={2} className='border border-white'>Comp</th>
              <th colSpan={2} className='border border-white'>Comp</th>
            </tr>
          </TableHead>
          <tbody className='bg-white'>
            {
              compromisosSemanales.map(item => (
                <tr key={item.tienda} className='text-right'>
                  <td colSpan={2} className='text-center bg-black text-white font-bold p-2'>
                    {item.tienda}
                  </td>
                  <td>{item.compromisoVenta}</td>
                  <td colSpan={2} className='pr-4'>
                    <input type="text" value={item.compromisoPromedios} className='w-16 outline-none bg-gray-200 text-right rounded-md pr-2' onChange={() => { }} />
                  </td>
                  <td colSpan={2} className='pr-4'>
                    <input type="text" value={item.compromisoOperaciones} className='w-16 outline-none bg-gray-200 text-right rounded-md pr-2' onChange={() => { }} />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
      <button className='blue-button text-white'>
        Grabar
      </button>
    </VentasLayout>
  )
}

export default compromiso
