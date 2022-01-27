import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, SelectMonth, SelectToMonth,InputToYear, InputYear, Checkbox,SelectPlazas } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import BarChart from '@components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';

const porplaza = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectPlazas/>
          <SelectMonth />
          <SelectToMonth />
          <InputYear value={2017} onChange={() => { }} />
          <InputToYear value={2022} onChange={() => {}}/>
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TOTAL} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.DETALLADO_POR_TIENDA} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters> 
          <SmallContainer>
        Esta grafica muestra las ventas de cada mes del año de la plaza seleccionada por cada uno de los años del rango especificado.
        </SmallContainer>
          <SmallContainer>
        Recuerde que el rango de años debe ser capturado de menor a el mayor, aunque en el reporte se mostrara en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Ventas Plaza del año 2017 al año 2021 (mls.dlls.) - iva no incluido'>
        <BarChart
          text='Ventas Plaza Mazatlán del año 2017 al año 2021 (mls.dlls.) - iva no incluido'
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
              {
                id: 1,
                label: '2021 68.0 %',
                data: [421, 358, 636, 810, 745, 709,930,492,428,532,547,586],
                backgroundColor: '#006400'
              },  
              {
                id: 2,
                label: '2020 -37.7 %',
                data: [391, 453, 263, 0, 0, 11, 486,728,545,496,445,461],
                backgroundColor: '#daa520'
              },
              {
                id: 3,
                label: '2019 18.8 %',
                data: [350, 273, 541, 1004, 483, 551, 1134,898,430,326,392,493],
                backgroundColor: '#6495ed'
              },
              {
                id: 4,
                label: '2018 8.3 %',
                data: [302,313,508,601,338,410,1075,770,354,286,377,454],
                backgroundColor: '#ff7f50'
              },
              {
                id: 5,
                label: '2017 0.0%',
                data: [330, 371, 316, 774, 381, 392, 805, 720, 291, 277, 327, 416],
                backgroundColor: '#98fb98'
              }
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default porplaza
