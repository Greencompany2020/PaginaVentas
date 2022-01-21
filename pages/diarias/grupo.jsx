import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectMonth, SelectPlazas, InputYear, Checkbox } from '@components/inputs';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead } from '@components/table';
import { ventasDiariasGrupo, checkboxLabels } from 'utils/data';

const grupo = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth />
            <InputYear value={2020} onChange={() => { }} />
            <SelectPlazas />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.SEMANA_SANTA} />
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
          Esta tabla muestra las ventas del día por día del mes y año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Diarias Grupo Frogs'>
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

export default grupo
