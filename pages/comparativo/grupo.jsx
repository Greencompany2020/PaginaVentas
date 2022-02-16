import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, Checkbox, InputDate } from '@components/inputs';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { checkboxLabels, ventasGrupo, ventasWeb } from 'utils/data';

const grupo = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_VS_COMPROMISO} />
            <Checkbox className='mb-3' labelText={checkboxLabels.NO_HORAS_VENTAS_PARCIALES} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.ACUMULADO_SEMANAL} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.RESULTADO_PESOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.TIPO_CAMBIO_TIENDAS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra un comparativo entre las ventas del año contra el año anterior. El comparativo se realiza por día, mes y año.
        </SmallContainer>
        <SmallContainer>
          Recuerde que la comparación se realiza lunes contra lunes, lo cual quiere decir que las ventas mensuales y anuales saldran con
        </SmallContainer>
        <SmallContainer>
          un dia desface para respetar esto.
        </SmallContainer>
        <SmallContainer>
          En esta temporada de semana santa se habilitará el check para intercambiar los dias de la temporada del año anterior.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='COMPARATIVO VENTAS DEL AÑO 2022 (AL 11 DE ENERO pesos -iva no incluido)'>
        <h2 className='text-center text-2xl p-3'>Tiendas Frogs</h2>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Tienda</th>
              <th colSpan={4}>Martes 11-Ene</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumlado Anual</th>
              <th rowSpan={2}>Tienda</th>
            </tr>
            <tr>
              <th>2022</th>
              <th>2021</th>
              <th>PPTO.</th>
              <th>%</th>
              <th>2022</th>
              <th>2021</th>
              <th>PPTO.</th>
              <th>(-)</th>
              <th>%</th>
              <th>2022</th>
              <th>2021</th>
              <th>PPTO.</th>
              <th>(-)</th>
              <th>%</th>
            </tr>
          </TableHead>
          <tbody className='text-center'>
            {
              ventasGrupo.map(tienda => (
                <tr key={tienda.tienda} className='bg-white text-black'>
                  <td>{tienda.tienda}</td>
                  <td>{tienda.ventasFechaActual}</td>
                  <td>{tienda.ventasFechaAnterior}</td>
                  <td>{tienda.ppto}</td>
                  <td>{tienda.porcentaje}</td>
                  <td>{tienda.acumuladoFechaActual}</td>
                  <td>{tienda.acumuladoFechaAnterior}</td>
                  <td>{tienda.acumuladoPPTO}</td>
                  <td>{tienda.acumuladoDiferencia}</td>
                  <td>{tienda.acumuladoPorc}</td>
                  <td>{tienda.anualFechaActual}</td>
                  <td>{tienda.anualFechaAnterior}</td>
                  <td>{tienda.anualPPTO}</td>
                  <td>{tienda.anualDiferencia}</td>
                  <td>{tienda.anualPorcentaje}</td>
                  <td>{tienda.tienda}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>

        <h2 className='text-center text-2xl p-3'>Tiendas En Linea</h2>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Tienda</th>
              <th colSpan={4}>Martes 11-Ene</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumlado Anual</th>
              <th rowSpan={2}>Tienda</th>
            </tr>
            <tr>
              <th>2022</th>
              <th>2021</th>
              <th>PPTO.</th>
              <th>%</th>
              <th>2022</th>
              <th>2021</th>
              <th>PPTO.</th>
              <th>(-)</th>
              <th>%</th>
              <th>2022</th>
              <th>2021</th>
              <th>PPTO.</th>
              <th>(-)</th>
              <th>%</th>
            </tr>
          </TableHead>
          <tbody>
            {
              ventasWeb.map(tienda => (
                <tr key={tienda.tienda} className='bg-white text-black'>
                  <td>{tienda.tienda}</td>
                  <td>{tienda.ventasFechaActual}</td>
                  <td>{tienda.ventasFechaAnterior}</td>
                  <td>{tienda.ppto}</td>
                  <td>{tienda.porcentaje}</td>
                  <td>{tienda.acumuladoFechaActual}</td>
                  <td>{tienda.acumuladoFechaAnterior}</td>
                  <td>{tienda.acumuladoPPTO}</td>
                  <td>{tienda.acumuladoDiferencia}</td>
                  <td>{tienda.acumuladoPorc}</td>
                  <td>{tienda.anualFechaActual}</td>
                  <td>{tienda.anualFechaAnterior}</td>
                  <td>{tienda.anualPPTO}</td>
                  <td>{tienda.anualDiferencia}</td>
                  <td>{tienda.anualPorcentaje}</td>
                  <td>{tienda.tienda}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default grupo
