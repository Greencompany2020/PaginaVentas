import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectPlazas,SelectMonth, SelectToMonth, InputYear, Checkbox } from '../../components/inputs';
import BarChart from '../../components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { checkboxLabels, inputNames } from '../../utils/data';
import { createOperacionesDatasets, getInitialPlaza, getPlazaName, validateMonthRange, validateYear } from '../../utils/functions';
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getOperacionesPlaza } from '../../services/OperacionesService';

const Plaza = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    promedio: 0,
    acumulado: 0,
    conIva: 0,
    ventasMilesDlls: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateMonthRange(paramPlaza.delMes, paramPlaza.alMes) && validateYear(paramPlaza.delAgno)) {
      getOperacionesPlaza(paramPlaza)
        .then(response => createOperacionesDatasets(response, paramPlaza.delAgno, setLabels, setDatasets));
    }
  }, [paramPlaza]);


  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas 
              value={paramPlaza.plaza}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <SelectMonth
              value={paramPlaza.delMes}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <SelectToMonth
              value={paramPlaza.alMes}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <InputYear
              value={paramPlaza.delAgno}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.PROMEDIO}
              name={inputNames.PROMEDIO}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_ACUMULADO}
              name={inputNames.ACUMULATIVA}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.OPERACIONES_EN_MILES}
              name={inputNames.VENTAS_MILES_DLLS}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
          </InputContainer>
          <InputContainer>
          <Checkbox 
            className='mb-3'
            labelText={checkboxLabels.DETALLADO_POR_TIENDA}
            onChange={(e) => {  }}
          />
          <Checkbox 
            className='mb-3'
            labelText={checkboxLabels.RESULTADO_PESOS}
            name={inputNames.RESULTADOS_PESOS}
            onChange={(e) => { handleChange(e, setParamPlaza) }}
          />
          </InputContainer>
        </Parameters>   
          <SmallContainer>
            Esta grafica muestra un comparativo de las ventas vs compromiso del grupo en el periodo de meses y
          </SmallContainer>
          <SmallContainer>
            el año especificado, este siempre será comparado contra el año anterior.
          </SmallContainer>
      </ParametersContainer>

      <ComparativoVentas title={`Operaciones realizadas Plaza ${getPlazaName(paramPlaza.plaza)} ${paramPlaza.delAgno}`}>
        <BarChart
          data={{
            labels,
            datasets
          }}
        />
      </ComparativoVentas>
    </>
  )
}

Plaza.getLayout = getVentasLayout;

export default Plaza