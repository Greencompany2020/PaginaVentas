import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, InputToYear, SelectMonth, SelectTiendasGeneral, Checkbox, InputYear } from '@components/inputs';
import { VentasTableContainer } from '@components/table';
import BarChart from '@components/BarChart';
import { checkboxLabels } from 'utils/data';

const plazas = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear />
            <InputToYear />
          </InputContainer>
          <InputContainer>
            <SelectMonth />
            <SelectTiendasGeneral />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta gráfica muestra las ventas anuales por plaza seguna el rango de años especificado.
        </SmallContainer>
        <SmallContainer>
          Recuerde que el rango de años debe ser capturado de el menor a el mayor, aunque en el reporte se mostraraa el orden descendiente.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Plazas Acumuladas a Diciembre del año 2018 al año 2021'>
        <BarChart
          data={{
            labels: ['MZT', 'CAN', 'PV', 'ACA', 'ISM', 'CAB', 'PC'],
            datasets: [
              {
                label: '2021',
                data: [7199, 2594, 2104, 3491, 602, 756, 1570],
                backgroundColor: '#991b1b'
              },
              {
                label: '2020',
                data: [4285, 1154, 1168, 2339, 333, 394, 865],
                backgroundColor: '#9a3412'
              },
              {
                label: '2019',
                data: [6881, 1642, 2183, 4272, 629, 659, 1394],
                backgroundColor: '#3f6212'
              },
              {
                label: '2018',
                data: [5793, 1501, 2071, 3518, 605, 571, 1337],
                backgroundColor: '#065f46'
              },
            ]
          }}
        />
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default plazas
