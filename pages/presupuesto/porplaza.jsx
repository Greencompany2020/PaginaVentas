import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectMonth, SelectToMonth, InputYear, SelectPlazas, Checkbox } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import BarChart from '@components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';

const todaslastiendas = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectPlazas/>
          <SelectMonth/>
          <SelectToMonth />
          <InputYear value={2022} onChange={() => {}} />
          </InputContainer>
          <InputContainer>
            <Checkbox labelText={checkboxLabels.ACUMULATIVA} />
            <Checkbox labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_COMPROMISO} />
            <Checkbox labelText={checkboxLabels.INCLUIR_EVENTOS} />
            <Checkbox labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
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
                backgroundColor: ['#047857']
              },
              {
                label: ['Presupuesto'],
                data: [61],
                backgroundColor: ['#0E7490']
              },
              {
                label: ['Ventas'],
                data: [90],
                backgroundColor: ['#1D4ED8']
              },
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default todaslastiendas
