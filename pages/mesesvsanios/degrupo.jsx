import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectMonth, SelectTiendasGeneral, InputYear, Checkbox } from '@components/inputs';
import { VentasTableContainer,} from '@components/table';
import { checkboxLabels } from 'utils/data';
import InputToYear from '../../components/inputs/InputToYear';
import SelectToMonth from '../../components/inputs/SelectToMonth';
import BarChart from '@components/BarChart';

const grupo = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <InputYear value={2017} onChange={() => { }} />
          <InputToYear value={2022} onChange={() => {}}/>
            <SelectMonth />
            <SelectToMonth />
            <SelectTiendasGeneral/>
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TOTAL} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL} />
            <Checkbox labelText={checkboxLabels.VENTAS_IVA} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
          </InputContainer>
        </Parameters> 
          <SmallContainer>
        Esta gráfica muestra las ventas anuales del grupo para cada uno de los años del rango especificado. 
        </SmallContainer>
          <SmallContainer>
        Recuerde que el rango de años debe ser capturado de el menor a el mayor aunque en el reporte se mostrará en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <VentasTableContainer title='Comparativo de ventas del año 2017 al año 2021 (mls.dlls) -iva no incluido'>
        <BarChart
          text='Comparativo de ventas del año 2017 al año 2021 (mls.dlls) -iva no incluido'
          data={{
            labels: ['MZT', 'CAN', 'PV', 'ACA', 'ISM', 'CAB', 'PC'],
            datasets: [
              {
                id: 1,
                label: '2022',
                data: [5079, 1469, 1383, 4047, 344, 434, 881],
                backgroundColor: '#006400'
              },  
              {
                id: 2,
                label: '2021',
                data: [8212, 2516, 2025, 5673, 814, 737, 2187],
                backgroundColor: '#daa520'
              },
              {
                id: 3,
                label: '2020',
                data: [7196, 2067, 2377, 8228, 775, 883, 1888],
                backgroundColor: '#6495ed'
              },
              {
                id: 4,
                label: '2019',
                data: [5893, 1946, 2083, 7353, 845, 706, 1870],
                backgroundColor: '#ff7f50'
              },
              {
                id: 5,
                label: '2018',
                data: [5330, 1838, 2323, 5749, 791, 688, 1668],
                backgroundColor: '#98fb98'
              },
            ]
          }}
        />
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default grupo
