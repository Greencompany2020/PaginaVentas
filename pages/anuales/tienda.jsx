import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { InputContainer, InputYear, SelectMonth, SelectTiendasGeneral, Checkbox } from '@components/inputs';
import { VentasTableContainer } from '@components/table';
import BarChart from '@components/BarChart';
import { checkboxLabels } from 'utils/data';

const tienda = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear />
            <SelectMonth />
          </InputContainer>
          <InputContainer>
            <SelectTiendasGeneral />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer >
          Esta gráfica muestra las ventas de cada una de las tiendas del grupo acumuladas del año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Acumuladas a Enero del Año 2022'>
        <BarChart
          text='Ventas al 10-Ene-2022'
          data={{
            labels: [
              'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M9', 'M10', 'CAB1', 'CAB3', 'IS-5',
              'OUTLET MCD', 'FORUM', 'PYA1', 'PYA4', 'PV2', 'PV4', 'PV6', 'ACA1', 'ACA2',
              'ACA5', 'ISM1'
            ],
            datasets: [
              {
                label: '',
                data: [
                  44, 62, 38, 20, 13, 11, 24, 39, 18, 2, 32, 8, 32, 21, 22, 35, 14, 18,
                  48, 118, 34, 17
                ],
                backgroundColor: '#155e75'
              }
            ]
          }}
        />
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default tienda
