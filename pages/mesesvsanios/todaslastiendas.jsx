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

      <ComparativoVentas title='Ventas de la Tienda ____ del año 2017 al año 2021 (mls.dlls.) - iva no incluido'>
        <BarChart
          text='Ventas de la Tienda ____ del año 2017 al año 2021 (mls.dlls.) - iva no incluido'
          data={{
            labels: ['M1','M2','M3','M4','M5','M6','M9','M10'],
            datasets: [
              {
                data: [73,90,59,33,20,19,37,61],
                backgroundColor: ['#991b1b','#9a3412','#3f6212','#065f46','#155e75','#581c87','#f472b6','#facc15']
              },
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default todaslastiendas
