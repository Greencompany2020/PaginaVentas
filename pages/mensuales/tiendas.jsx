import VentasLayout from '@components/layout/VentasLayout';
import { InputContainer, SelectMonth, InputYear, SelectTiendasGeneral, Checkbox } from '@components/inputs';
import { ParametersContainer, Parameters, SmallContainer } from '@components/containers';
import { VentasTableContainer } from '@components/table';
import BarChart from '@components/BarChart';
import { checkboxLabels } from 'utils/data';

const tiendas = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth />
            <InputYear />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <SelectTiendasGeneral />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta grafica muestra las ventas de todas las tiendas del grupo del mes seleccionado en el año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas del mes Enero del año 2020 al 2018'>
        <BarChart
          text='Ventas al 10-Ene-2022'
          data={{
            labels: [
              'M1', 'M2', 'M3', 'M4', 'M5', 'M5', 'M6', 'M9', 'M10', 'IS-OUTLET',
              'FORUM', 'PV2', 'PV4', 'PV6', 'ACA1', 'ACA2', 'ACA5', 'ISM1', 'CAB1',
              'CAB3', 'PYA1', 'PYA4'
            ],
            datasets: [
              {
                id: 1,
                label: '',
                data: [
                  883, 1240, 777, 417, 263, 221, 497, 781, 645, 177, 646, 716,
                  298, 370, 977, 2871, 697, 349, 375, 59, 430, 451
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

export default tiendas
