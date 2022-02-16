import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, InputYear, SelectTiendasGeneral, Checkbox } from '@components/inputs';
import { VentasTableContainer, VentasTable, TableHead, TableBody } from '@components/table';
import { checkboxLabels, participacionVentas } from 'utils/data';

const participacion = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear />
            <SelectTiendasGeneral />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra la participación de ventas en el mes de cada una de las tiendas en razon de las vents generales en el año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='PARTICIPACION DE VENTAS DE TIENDAS EN EL AÑO 2022 -iva no incluido'>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>TDA.</th>
              <th colSpan={2}>ENE</th>
              <th colSpan={2}>FEB</th>
              <th colSpan={2}>MAR</th>
              <th colSpan={2}>ABR</th>
              <th colSpan={2}>MAY</th>
              <th colSpan={2}>JUN</th>
              <th colSpan={2}>JUL</th>
              <th colSpan={2}>AGO</th>
              <th colSpan={2}>SEP</th>
              <th colSpan={2}>OCT</th>
              <th colSpan={2}>NOV</th>
              <th colSpan={2}>DIC</th>
              <th rowSpan={2}>TOTAL AÑO</th>
            </tr>
            <tr>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
              <th>$</th>
              <th>%</th>
            </tr>
          </TableHead>
          <TableBody>
            {
              participacionVentas.map(venta => (
                <tr key={venta.venta} className='text-center'>
                  <td>{venta.tienda}</td>
                  <td>{venta.venta}</td>
                  <td>{venta.porcentaje}</td>
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
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              ))
            }
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default participacion
