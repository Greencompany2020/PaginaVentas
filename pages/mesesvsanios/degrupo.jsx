import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectMonth, SelectTiendasGeneral, InputYear, Checkbox,InputToYear,SelectToMonth } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import BarChart from '@components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';

const degrupo = () => {
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
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS} />
            </InputContainer>
            <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
          </InputContainer>
        </Parameters> 
          <SmallContainer>
        Esta gráfica muestra las ventas anuales del grupo para cada uno de los años del rango especificado. 
        </SmallContainer>
          <SmallContainer>
        Recuerde que el rango de años debe ser capturado de el menor a el mayor aunque en el reporte se mostrará en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Comparativo de ventas del año 2017 al año 2021 (mls.dlls) -iva no incluido'>
        <BarChart
          text='Comparativo de ventas del año 2017 al año 2021 (mls.dlls) -iva no incluido'
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
              {
                id: 1,
                label: '2021 73.8 %',
                data: [1136, 855, 1481, 1756, 1808, 1688,2309,1514,1120,1410,1527,1709],
                backgroundColor: '#006400'
              },  
              {
                id: 2,
                label: '2020 -40.3 %',
                data: [1272, 1129, 732, 0, 0, 77, 1015,1425,1254,1146,1199,1275],
                backgroundColor: '#daa520'
              },
              {
                id: 3,
                label: '2019 14.7 %',
                data: [1138, 838, 1227, 2417, 1408, 1343, 2609,2086,1088,901,1111,1490],
                backgroundColor: '#6495ed'
              },
              {
                id: 4,
                label: '2018 10.5 %',
                data: [1018, 791, 1427, 1510, 993, 1022, 2536, 1906,938,853,1030,1371],
                backgroundColor: '#ff7f50'
              },
              {
                id: 5,
                label: '2017 0.0 %',
                data: [1062, 777, 825, 1869, 1092, 935, 1906,1727,770,761,955,1254],
                backgroundColor: '#98fb98'
              }
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default degrupo
