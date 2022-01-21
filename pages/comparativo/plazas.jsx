import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { InputContainer, Checkbox, InputDate } from '@components/inputs';
import { checkboxLabels, ventasPlazas, ventasPlazaWeb } from 'utils/data';

const plazas = () => {
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

      <VentasTableContainer>
        <h2 className='text-center text-2xl p-3'>Tiendas Frogs</h2>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Plaza</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumulado Anual</th>
              <th rowSpan={2}>Plaza</th>
            </tr>
            <tr>
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
              ventasPlazas.map(plaza => (
                <tr key={plaza.plaza} className='bg-white text-black'>
                  <td>{plaza.plaza}</td>
                  <td>{plaza.ventasFechaActual}</td>
                  <td>{plaza.ventasFechaAnterior}</td>
                  <td>{plaza.ppto}</td>
                  <td>{plaza.diferencia}</td>
                  <td>{plaza.porcentaje}</td>
                  <td>{plaza.ventasFechaActual}</td>
                  <td>{plaza.ventasFechaAnterior}</td>
                  <td>{plaza.ppto}</td>
                  <td>{plaza.diferencia}</td>
                  <td>{plaza.porcentaje}</td>
                  <td>{plaza.plaza}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>

        <h2 className='text-center text-2xl p-3'>Tiendas Frogs - Proyectos</h2>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Plaza</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumulado Anual</th>
              <th rowSpan={2}>Plaza</th>
            </tr>
            <tr>
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
            <tr className='bg-white text-black'>
              <td>GRUPO</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>GRUPO</td>
            </tr>
          </tbody>
        </VentasTable>

        <h2 className='text-center text-2xl p-3'>Tiendas Skoro</h2>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Plaza</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumulado Anual</th>
              <th rowSpan={2}>Plaza</th>
            </tr>
            <tr>
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
            <tr className='bg-white text-black'>
              <td>GRUPO</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>GRUPO</td>
            </tr>
          </tbody>
        </VentasTable>

        <h2 className='text-center text-2xl p-3'>Tiendas En Linea</h2>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Plaza</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumulado Anual</th>
              <th rowSpan={2}>Plaza</th>
            </tr>
            <tr>
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
              ventasPlazaWeb.map(plaza => (
                <tr key={plaza.plaza} className='bg-white text-black'>
                  <td>{plaza.plaza}</td>
                  <td>{plaza.ventasFechaActual}</td>
                  <td>{plaza.ventasFechaAnterior}</td>
                  <td>{plaza.ppto}</td>
                  <td>{plaza.diferencia}</td>
                  <td>{plaza.porcentaje}</td>
                  <td>{plaza.ventasFechaActual}</td>
                  <td>{plaza.ventasFechaAnterior}</td>
                  <td>{plaza.ppto}</td>
                  <td>{plaza.diferencia}</td>
                  <td>{plaza.porcentaje}</td>
                  <td>{plaza.plaza}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default plazas
