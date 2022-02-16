import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, Checkbox, SelectTiendasGeneral, InputDate } from '@components/inputs';
import { VentasTableContainer, VentasTable, TableBody, TableHead } from '@components/table';
import { checkboxLabels, crecimientoTabla } from 'utils/data';

const crecimiento = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate />
            <SelectTiendasGeneral />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra el factor de crecimiento de las tiendas sobre la ventas del mes y acumuladas,
        </SmallContainer>
        <SmallContainer>
          con respecto a años anteriores segun la fecha especificada.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Factor de crecimiento al 12 de Enero de 2022 Acumulado y Anual -iva no incluido'>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Tiendas</th>
              <th rowSpan={2}>Ventas Acum. 2022</th>
              <th colSpan={6}>Factor Crecimiento</th>
              <th colSpan={7}>Factor Crecimiento</th>
            </tr>
            <tr>
              <th>22</th>
              <th>21</th>
              <th>20</th>
              <th>19</th>
              <th>18</th>
              <th>17</th>
              <th>Enero-2022</th>
              <th>22</th>
              <th>21</th>
              <th>20</th>
              <th>19</th>
              <th>18</th>
              <th>17</th>
            </tr>
          </TableHead>
          <TableBody>
            {
              crecimientoTabla.map(item => (
                <tr key={item.tienda} className='text-center'>
                  <td>{item.tienda}</td>
                  <td>{item.acum}</td>
                  <td>24</td>
                  <td>-41</td>
                  <td>20</td>
                  <td>32</td>
                  <td>-1</td>
                  <td>-24</td>
                  <td>128</td>
                  <td>24</td>
                  <td>-41</td>
                  <td>20</td>
                  <td>32</td>
                  <td>-1</td>
                  <td>-24</td>
                </tr>
              ))
            }
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default crecimiento
