import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectPlazas,SelectMonth, SelectToMonth, InputYear, Checkbox } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import BarChart from '@components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';

const portienda = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectPlazas/>
          <SelectMonth />
          <SelectToMonth />
          <InputYear/>
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.PROMEDIO} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_ACUMULADO} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.OPERACIONES_EN_MILES} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
          </InputContainer>
          <InputContainer>
          <Checkbox className='mb-3' labelText={checkboxLabels.DETALLADO_POR_TIENDA} />
          <Checkbox className='mb-3' labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>   
          <SmallContainer>
        Esta grafica muestra un comparativo de las ventas vs compromiso del grupo en el periodo de meses y
        </SmallContainer>
          <SmallContainer>
        el año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Ventas por Mes Tiendas Plaza Mazatlán año 2022 (mls.pesos) -iva no incluido'>
        <BarChart
          text='Ventas por Mes Tiendas Plaza Mazatlán año 2022 (mls.pesos) -iva no incluido'
          data={{
            labels: ['%'],
            datasets: [
              {
                label: ['Ventas'],
                data: [73],
                backgroundColor: ['#EF4444']
              },
              {
                label: ['Presupuesto'],
                data: [61],
                backgroundColor: ['#F97316']
              },
              {
                label: ['Ventas'],
                data: [90],
                backgroundColor: ['#F59E0B']
              },
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default portienda
