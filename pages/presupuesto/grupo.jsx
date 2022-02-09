import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectMonth, SelectToMonth, InputYear, SelectTiendasGeneral, Checkbox } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import BarChart from '@components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';

const todaslastiendas = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectMonth />
          <SelectToMonth/>
          <InputYear/>
          <SelectTiendasGeneral/>
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
          Esta grafica muestra las ventas vs. compromiso del grupo en el periodo de meses y 
        </SmallContainer>
          <SmallContainer>
          el año especificado,este siempre será comparado contra el año anterior.        
          </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Ventas por Mes Tiendas Plaza Mazatlán año 2022 (mls.pesos) -iva no incluido'>
        <BarChart
          text='Ventas por Mes Tiendas Plaza Mazatlán año 2022 (mls.pesos) -iva no incluido'
          data={{
            labels: ['%'],
            datasets: [
              {
                label: ['Ventas 2022'],
                data: [1305],
                backgroundColor: ['#F43F5E']
              },
              {
                label: ['Presupuesto'],
                data: [1102],
                backgroundColor: ['#EA580C']
              },
              {
                label: ['Ventas 2021'],
                data: [1136],
                backgroundColor: ['#0284C7']
              },
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default todaslastiendas
