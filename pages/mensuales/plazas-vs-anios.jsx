import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { VentasTableContainer } from '@components/table';
import { InputContainer, Checkbox, SelectMonth, InputYear, SelectTiendasGeneral, InputToYear } from '@components/inputs';
import BarChart from '@components/BarChart';
import { checkboxLabels } from 'utils/data';

const plazasVS = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth />
            <InputYear value={2022} onChange={() => { }} />
            <InputToYear value={2020} onChange={() => { }} />
          </InputContainer>
          <InputContainer>
            <SelectTiendasGeneral />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta gráfica muestra las ventas por plaza del mes seleccionado en el rango de años especificado.
        </SmallContainer>
        <SmallContainer>
          Recuerde que el rango de años debe ser capturado de menor a el mayor, aunque en el reporte se mostrara en orden descendente.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas del mes Enero del año 2020 al 2018'>
        <BarChart
          text='Ventas al 10-Ene-2022'
          data={{
            labels: ['MZT', 'CAN', 'PV', 'ACA', 'ISM', 'CAB', 'PC'],
            datasets: [
              {
                id: 1,
                label: '2022',
                data: [5079, 1469, 1383, 4047, 344, 434, 881],
                backgroundColor: '#991b1b'
              },  
              {
                id: 2,
                label: '2021',
                data: [8212, 2516, 2025, 5673, 814, 737, 2187],
                backgroundColor: '#9a3412'
              },
              {
                id: 3,
                label: '2020',
                data: [7196, 2067, 2377, 8228, 775, 883, 1888],
                backgroundColor: '#3f6212'
              },
              {
                id: 4,
                label: '2019',
                data: [5893, 1946, 2083, 7353, 845, 706, 1870],
                backgroundColor: '#065f46'
              },
              {
                id: 5,
                label: '2018',
                data: [5330, 1838, 2323, 5749, 791, 688, 1668],
                backgroundColor: '#155e75'
              },
            ]
          }}
        />
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default plazasVS
