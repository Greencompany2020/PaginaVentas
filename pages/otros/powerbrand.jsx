import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, InputDate } from '@components/inputs';
import { VentasTableContainer, VentasTable, TableHead, TableBody } from '@components/table';

const powerbrand = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra las ventas acumuladas dia-semana-año
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer className='POWERBRAND COMPARATIVO VENTAS DEL AÑO 2022 (AL 11 DE ENERO S/IVA M.N. )'>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Pedidos Actuales</th>
              <th colSpan={3}>Semana del 10 de Ene</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumulado Anual</th>
            </tr>
            <tr>
              <th>2020</th>
              <th>2021</th>
              <th>%</th>
              <th>Presupuesto</th>
              <th>2022</th>
              <th>2021</th>
              <th>% VS 2021</th>
              <th>% VS Ppto.</th>
              <th>Presupuesto</th>
              <th>2022</th>
              <th>2021</th>
              <th>% VS 2021</th>
              <th>% VS Ppto.</th>
            </tr>
          </TableHead>
          <TableBody>
            <tr className='text-center'>
              <td>127,917</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>62,459</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>62,459</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr className='text-center'>
              <td>127,917</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>62,459</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>62,459</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default powerbrand
