import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, InputYear, SelectPlazas, Checkbox } from '@components/inputs';
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
          <InputYear value={2017} onChange={() => { }} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>   
          <SmallContainer>
        Esta grafica muestra un comparativo de las ventas por mes de todas las tiendas de la plaza seleccionada en el año que fue especificado.
        </SmallContainer>
          <SmallContainer>
        Recuerde que el rango de años debe ser capturado de menor a el mayor, aunque en el reporte se mostrara en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Ventas por Mes Tiendas Plaza Mazatlán año 2022 (mls.pesos) -iva no incluido'>
        <BarChart
          text='Ventas por Mes Tiendas Plaza Mazatlán año 2022 (mls.pesos) -iva no incluido'
          data={{
            labels: ['Enero'],
            datasets: [
              {
                label: ['M1'],
                data: [73],
                backgroundColor: ['#b91c1c']
              },
              {
                label: ['M2'],
                data: [61],
                backgroundColor: ['#a16207']
              },
              {
                label: ['M3'],
                data: [90],
                backgroundColor: ['#4d7c0f']
              },
              {
                label: ['M4'],
                data: [59],
                backgroundColor: ['#0369a1']
              },
              {
                label: ['M5'],
                data: [33],
                backgroundColor: ['#4338ca']
              },
              {
                label: ['M6'],
                data: [20],
                backgroundColor: ['#a21caf']
              },
              {
                label: ['M9'],
                data: [19],
                backgroundColor: ['#be123c']
              },
              {
                label: ['M10'],
                data: [37],
                backgroundColor: ['#0f172a']
              },
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default todaslastiendas
