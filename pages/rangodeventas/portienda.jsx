import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectMonth, SelectTiendas, InputDateDate, Checkbox,InputToYear,SelectToMonth } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import PieChart from '../../components/Pie';

const degrupo = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectTiendas/>
          <h1>Obtener Rangos de Ventas de las fechas:</h1>
          <InputDateDate/>
         
          </InputContainer>
        </Parameters> 
          <SmallContainer>
        Este reporte obtiene rangos de venta de las fechas establecidas 
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Rangos de ventas por plaza'>
        <PieChart
          text='Rangos de ventas por plaza'
          data={{
            labels: ['Hasta 100', 'Hasta 200', 'Hasta 300', 'Hasta 400', 'Hasta 500', 'Hasta 600', 'Mayor a 600' ],
  datasets: [
    {
      label: '# of Votes',
      data: [898, 2308, 4001, 3006, 2798, 2572, 17259],
      backgroundColor: [
        'rgba(255, 100, 94, 1)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',

      ],
      borderColor: [
        'rgba(255, 100, 94, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
              }
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default degrupo
