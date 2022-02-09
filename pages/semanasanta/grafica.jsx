import VentasLayout from '@components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer,Flex } from '@components/containers';
import { InputContainer, InputYear, InputVsYear, SelectTiendas,SelectPlazas, Checkbox } from '@components/inputs';
import { VentasTableContainer } from '@components/table';
import BarChart from '@components/BarChart';
import { useState } from 'react';
import { checkboxLabels} from 'utils/data';

const grafica = ({year1,year2}) => {
  year1 = 1
  year2 = "year2"
  const [toggleTienda, setToggleTienda] = useState(true);
  const [togglePlaza, setTogglePlaza] = useState(false);

  const handleVisibleTienda = () => {
    setToggleTienda(true);
    setTogglePlaza(false);
  }

  const handleVisiblePlaza = () => {
    setTogglePlaza(true);
    setToggleTienda(false);
  }

  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <Flex className='mb-3'>
              <p className='mr-3'>Mostrar: </p>
              <Flex>
                <button onClick={handleVisibleTienda} className='buttonToggle mr-1'>Por Tienda</button>
                <button onClick={handleVisiblePlaza} className='buttonToggle'>Por Plaza</button>
              </Flex>
            </Flex>
            {
              toggleTienda && <SelectTiendas />
            }
            {
              togglePlaza && <SelectPlazas />
            }
          </InputContainer>
          <InputContainer>
            <InputYear />
            <InputVsYear />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_ACUMULADO} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.RESULTADO_PESOS} /> 
          </InputContainer>
        </Parameters>
        <SmallContainer>
        Este reporte muestra las ventas de semana santa del año seleccionado comparadas con el año anterior y su porcentaje de variacion. 
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Comparativo Semana Santa Grupo Frogs 2018 vs 2019 (mls.pesos) -iva no incluido'>
        <BarChart
          text='Años'
          data={{
            labels: [
              '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'
              
            ],
            datasets: [
              {
                label: {year1},
                data: [
                  44, 62, 38, 20, 13, 11, 24, 39, 18, 2, 32, 8, 32, 21, 22, 35, 14, 18,
                  48, 118, 34, 17
                ],
                
                backgroundColor: '#155e75'
              },
              {
                label: {year2},
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

export default grafica
