import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, SelectTiendasGeneral, Checkbox, InputToYear, SelectToMonth } from '../../components/inputs';
import { VentasTableContainer } from '../../components/table';
import BarChart from '../../components/BarChart';
import { checkboxLabels } from '../../utils/data';
import { formatedDate, formatLastDate, getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { inputNames } from '../../utils/data';
import { getAnualesTiendas } from '../../services/AnualesServices';
import { createSimpleDatasets } from '../../utils/functions';

const Tienda = () => {
  const [labels, setLabels] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [tiendasParametros, setTiendasParametros] = useState({
    alAgno: getCurrentYear(),
    alMes: getCurrentMonth(),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1
  });

  useEffect(() => {
    if (tiendasParametros.alAgno.toString().length === 4) {
      getAnualesTiendas(tiendasParametros)
        .then(response => createSimpleDatasets(response, setLabels, setDataset));
    }
  }, [tiendasParametros]);

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputToYear
              value={tiendasParametros.alAgno}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <SelectToMonth
              value={tiendasParametros.alMes}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <SelectTiendasGeneral
              value={tiendasParametros.tiendas}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              checked={tiendasParametros.resultadosPesos ? true : false}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer >
          Esta gráfica muestra las ventas de cada una de las tiendas del grupo acumuladas del año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer
        title={`Ventas Acumuladas a ${getMonthByNumber(tiendasParametros.alMes)} del ${tiendasParametros.alAgno}`}
      >
        <BarChart
          text={`Ventas al ${formatLastDate(formatedDate(tiendasParametros.alAgno, tiendasParametros.alMes))}`}
          data={{
            labels: labels,
            datasets: dataset
          }}
        />
      </VentasTableContainer>
    </>
  )
}

Tienda.getLayout = getVentasLayout;

export default Tienda
