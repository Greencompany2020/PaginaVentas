import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectTiendas,SelectMonth, SelectToMonth, InputYear, Checkbox } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import BarChart from '../../components/BarChart';
import { getPresupuestoTienda } from '../../services/PresupuestoService';
import { checkboxLabels, inputNames } from '../../utils/data';
import { getInitialTienda, validateMonthRange, validateYear, createPresupuestoDatasets, getTiendaName } from '../../utils/functions'
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';

const Tienda = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    total: 0,
    acumulado: 0,
    total: 0,
    conIva: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateMonthRange(paramTienda.delMes, paramTienda.alMes) && validateYear(paramTienda.delAgno)) {
      getPresupuestoTienda(paramTienda)
        .then(response => createPresupuestoDatasets(response, paramTienda.delAgno, setLabels, setDatasets))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda]);

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectTiendas 
              value={paramTienda.tienda}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <SelectMonth
              value={paramTienda.delMes}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <SelectToMonth
              value={paramTienda.alMes}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <InputYear 
              value={paramTienda.delAgno}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.ACUMULATIVA}
              name={inputNames.ACUMULATIVA}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.GRAFICAR_TOTAL}
              name={inputNames.GRAFICAR_TOTAL}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => { handleChange(e, setParamTienda) }}
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

      <ComparativoVentas title={`Ventas por Mes Tienda ${getTiendaName(paramTienda.tienda)} del año ${paramTienda.delAgno}`}>
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

Tienda.getLayout = getVentasLayout;

export default Tienda
