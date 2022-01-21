import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { InputContainer, InputYear, Checkbox } from '@components/inputs';
import { checkboxLabels, ventasMensualesConcentrado, concentradoPlazas } from 'utils/data';

const concentrado = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear value={2022} onChange={() => { }} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_EN_DLLS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra las ventas por tienda en el año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Mensuales de tiendas en el año 2022'>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>TDA.</th>
              <th>ENE</th>
              <th>FEB</th>
              <th>MAR</th>
              <th>ABR</th>
              <th>MAY</th>
              <th>JUN</th>
              <th>JUL</th>
              <th>AGO</th>
              <th>SEP</th>
              <th>OCT</th>
              <th>NOV</th>
              <th>DIC</th>
              <th>TTAL</th>
            </tr>
            <tr className='text-center'>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>Año</th>
            </tr>
          </TableHead>
          <tbody className='bg-white'>
            {
              ventasMensualesConcentrado.map(items => (
                <tr key={items.TDA} className={`text-center ${concentradoPlazas.includes(items.TDA) ? 'bg-gray-200' : ''}`}>
                  <td className='bg-black text-white font-bold'>{items.TDA}</td>
                  <td>{items.ENE}</td>
                  <td>{items.FEB}</td>
                  <td>{items.MAR}</td>
                  <td>{items.ABR}</td>
                  <td>{items.MAY}</td>
                  <td>{items.JUN}</td>
                  <td>{items.JUL}</td>
                  <td>{items.AGO}</td>
                  <td>{items.SEP}</td>
                  <td>{items.OCT}</td>
                  <td>{items.NOV}</td>
                  <td>{items.DIC}</td>
                  <td>{items.TTAL}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default concentrado
