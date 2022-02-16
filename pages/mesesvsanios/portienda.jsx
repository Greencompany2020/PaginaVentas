import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer,SelectTiendas, SelectMonth, SelectToMonth,InputToYear, InputYear, Checkbox } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import BarChart from '@components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';

const portienda = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectTiendas />
          <SelectMonth />
          <SelectToMonth />
          <InputYear value={2017} onChange={() => { }} />
          <InputToYear value={2022} onChange={() => {}}/>
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TOTAL} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL} />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
          </InputContainer>
        </Parameters>   
          <SmallContainer>
        Esta grafica muestra las ventas de cada mes del año de la plaza seleccionada por cada uno de los años del rango especificado.
        </SmallContainer>
          <SmallContainer>
        Recuerde que el rango de años debe ser capturado de menor a el mayor, aunque en el reporte se mostrara en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Ventas de la Tienda ____ del año 2017 al año 2021 (mls.dlls.) - iva no incluido'>
        <BarChart
          text='Ventas de la Tienda ____ del año 2017 al año 2021 (mls.dlls.) - iva no incluido'
          data={{
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [
              {
                id: 1,
                label: '2021 68.0 %',
                data: [76,67,123,149,122,132,187,93,82,87,93,98],
                backgroundColor: '#991b1b'
              },  
              {
                id: 2,
                label: '2020 -37.7 %',
                data: [74,83,43,0,0,0,65,123,94,93,78,81],
                backgroundColor: '#9a3412'
              },
              {
                id: 3,
                label: '2019 18.8 %',
                data: [56,40,84,167,58,73,150,114,59,0,49,83],
                backgroundColor: '#3f6212'
              },
              {
                id: 4,
                label: '2018 8.3 %',
                data: [51,51,91,107,47,79,160,113,57,41,60,71],
                backgroundColor: '#065f46'
              },
              {
                id: 5,
                label: '2017 0.0%',
                data: [49,53,46,128,55,52,107,101,37,41,54,72],
                backgroundColor: '#155e75'
              }
              
            ]
          }}
        />
      </ComparativoVentas>
    </VentasLayout>
  )
}

export default portienda
