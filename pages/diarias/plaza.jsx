import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { VentasTableContainer, VentasTable, VentasDiariasTableHead, VentasDiariasTableFooter } from '@components/table';
import { InputContainer, SelectPlazas, SelectMonth, InputYear, Checkbox } from '@components/inputs';
import { ventasDiariasGrupo, checkboxLabels } from 'utils/data';

const plaza = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas />
            <SelectMonth />
            <InputYear value={2020} onChange={() => { }} />
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
          Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Diarias Plaza MAZATLAN'>
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

export default plaza
