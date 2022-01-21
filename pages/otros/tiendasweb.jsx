import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, InputDate } from '@components/inputs';
import { VentasTableContainer, VentasTable, TableHead, TableBody } from '@components/table';

const tiendasweb = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra las ventas acumuladas semana-mes-año
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='TIENDAS WEB COMPARATIVO VENTAS DEL AÑO 2022 (AL 12 DE ENERO S/IVA M.N. )'>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Pedidos Actuales</th>
              <th colSpan={3}>Dia 11 de Enero</th>
              <th colSpan={5}>Acumulado Enero</th>
              <th colSpan={5}>Acumulado Anual</th>
            </tr>
            <tr>
              <th>2022</th>
              <th>2021</th>
              <th>% VS 2021</th>
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
              <td>FROGS</td>
              <td>451</td>
              <td>7,478</td>
              <td>(91)</td>
              <td>0</td>
              <td>54,764</td>
              <td>116,915</td>
              <td>(52)</td>
              <td>0</td>
              <td>0</td>
              <td>54,764</td>
              <td>116,915</td>
              <td>(52)</td>
              <td>0</td>
            </tr>
            <tr className='text-center'>
              <td>FROGS</td>
              <td>451</td>
              <td>7,478</td>
              <td>(91)</td>
              <td>0</td>
              <td>54,764</td>
              <td>116,915</td>
              <td>(52)</td>
              <td>0</td>
              <td>0</td>
              <td>54,764</td>
              <td>0</td>
              <td>(52)</td>
              <td>0</td>
            </tr>
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default tiendasweb
