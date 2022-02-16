import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead } from '@components/table';
import { InputContainer, SelectMonth, InputYear, SelectTiendas, Checkbox } from '@components/inputs';
import { ventasDiariasGrupo, checkboxLabels } from 'utils/data';

const tienda = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth />
            <InputYear value={2020} onChange={() => { }} />
            <SelectTiendas />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.SEMANA_SANTA} />
            <Checkbox labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Diarias M1'>
        <VentasTable>
          <VentasDiariasTableHead />
          <tbody className='bg-white text-right'>
            {
              ventasDiariasGrupo.map(item => (
                <tr key={item.fechaActual}>
                  <td className='text-center'>{item.fechaActual}</td>
                  <td className='text-center'>{item.fechaAnterior}</td>
                  <td>{item.ventaDiariaFechaActual}</td>
                  <td>{item.ventaDiariaFechaAnterior}</td>
                  <td>{item.ventaDiariaComp}</td>
                  <td>{item.ventaDiariaPor}</td>
                  <td>{item.acumuladoFechaActual}</td>
                  <td>{item.acumuladoFechaAnterior}</td>
                  <td>{item.acumuladoComp}</td>
                  <td>{item.diferenciaAcumulado}</td>
                  <td>{item.acumuladoPor}</td>
                  <td>{item.acumuladoAnualFechaActual}</td>
                  <td>{item.acumuladoAnualFechaAnterior}</td>
                  <td>{item.acumuladoAnualComp}</td>
                  <td>{item.acumuladoAnualPor}</td>
                  <td className='text-center'>{item.fechaActual}</td>
                </tr>
              ))
            }
          </tbody>
          <VentasDiariasTableFooter />
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default tienda
