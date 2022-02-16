import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer, Flex } from '@components/containers';
import { InputContainer, InputYear, InputToYear, Checkbox, SelectTiendas, SelectPlazas } from '@components/inputs';
import { VentasTableContainer, VentasTable, TableBody, TableHead } from '@components/table';
import { useState } from 'react';
import { checkboxLabels, porcentajesMensuales } from 'utils/data';

const Mensuales = () => {
  const [toggleTienda, setToggleTienda] = useState(true);
  const [togglePlaza, setTogglePlaza] = useState(false);

  const handleVisibleTienda = () => {
    setToggleTienda(true);
    setTogglePlaza(false);
  }

  const handleVisiblePlaza = () => {
    setTogglePlaza(true);
    setToggleTienda(false);
  }

  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <Flex className='mb-3'>
              <p className='mr-3'>Mostrar: </p>
              <Flex>
                <button onClick={handleVisibleTienda} className='buttonToggle mr-1'>Por Tienda</button>
                <button onClick={handleVisiblePlaza} className='buttonToggle'>Por Plaza</button>
              </Flex>
            </Flex>
            {
              toggleTienda && <SelectTiendas />
            }
            {
              togglePlaza && <SelectPlazas />
            }
          </InputContainer>
          <InputContainer>
            <InputYear />
            <InputToYear />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          ESTA GRAFICA MUESTRA UN EL PORCENTAJE DE VENTA DEL MES EN RAZON DE LA VENTA ANUAL LA TIENDA SELECCIONADA EN EL RANGO DE AÑOS ESPECIFICADO.
        </SmallContainer>
        <SmallContainer>
          RECUERDE QUE EL RANGO DE AÑOS DEBE SER CAPTURADO DE MENOR A EL MAYOR, AUNQUE EN EL REPORTE SE MOSTRARA EN ORDEN DESCENDENTE.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='PROPORCION DE VENTAS MENSUALES VS. VENTA ANUAL -iva no incluido'>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Año</th>
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
              <th rowSpan={2}>TOTAL ANUAL</th>
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
              porcentajesMensuales.map(item => (
                <tr className='text-center' key={item.fecha}>
                  <td>{item.fecha}</td>
                  <td>{item.totalEnero}</td>
                  <td>{item.porcentajeEnero}</td>
                  <td>{item.totalFebrero}</td>
                  <td>{item.porcentajeFebrero}</td>
                  <td>{item.totalMarzo}</td>
                  <td>{item.porcentajeMarzo}</td>
                  <td>{item.totalAbril}</td>
                  <td>{item.porcentajeAbril}</td>
                  <td>{item.totalMayo}</td>
                  <td>{item.porcentajeMayo}</td>
                  <td>{item.totalJunio}</td>
                  <td>{item.porcentajeJunio}</td>
                  <td>{item.totalJulio}</td>
                  <td>{item.porcentajeJulio}</td>
                  <td>{item.totalAgosto}</td>
                  <td>{item.porcentajeAgosto}</td>
                  <td>{item.totalSeptiembre}</td>
                  <td>{item.porcentajeSeptiembre}</td>
                  <td>{item.totalOctubre}</td>
                  <td>{item.porcentajeOctubre}</td>
                  <td>{item.totalNoviembre}</td>
                  <td>{item.porcentajeNoviembre}</td>
                  <td>{item.totalDiciembre}</td>
                  <td>{item.porcentajeDiciembre}</td>
                  <td>{item.total}</td>
                </tr>
              ))
            }
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default Mensuales
