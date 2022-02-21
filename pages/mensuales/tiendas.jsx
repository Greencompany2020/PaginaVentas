import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { InputContainer, SelectMonth, InputToYear, SelectTiendasGeneral, Checkbox } from '../../components/inputs';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer } from '../../components/table';
import BarChart from '../../components/BarChart';
import { checkboxLabels, inputNames } from '../../utils/data';
import { formatedDate, formatLastDate, getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getMensualesTiendas } from '../../services/MensualesServices';

const Tiendas = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [tiendasParametros, setTiendasParametros] = useState({
    delMes: getCurrentMonth(),
    alAgno: getCurrentYear(),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1
  });

  useEffect(() => {
    if (tiendasParametros.alAgno.toString().length === 4) {
      getMensualesTiendas(tiendasParametros)
        .then(response => createDatesets(response))
    }
  }, [tiendasParametros]);

  const createDatesets = (data) => {
    if (data?.length !== 0) {
      let labels = data?.map(item => item.Descrip);
      let datasetItem = {};
      let datasets = [];

      datasetItem.id = 1;
      datasetItem.label = '';
      datasetItem.data = data?.map(item => item.Ventas);
      datasetItem.backgroundColor = '#155e75';

      datasets.push(datasetItem);

      setLabels(labels);
      setDatasets(datasets);
    } else {
      setLabels([]);
      setDatasets([]);
    }
  }

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth
              value={tiendasParametros.delMes}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <InputToYear
              value={tiendasParametros.alAgno}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
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
              onChange={(e) => handleChange(e, setTiendasParametros)}
              checked={tiendasParametros.resultadosPesos ? true : false}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta grafica muestra las ventas de todas las tiendas del grupo del mes seleccionado en el año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer
        title={`Ventas del mes de ${getMonthByNumber(tiendasParametros.delMes)} del año ${tiendasParametros.alAgno}`}
      >
        <BarChart
          text={`Ventas al ${formatLastDate(formatedDate(tiendasParametros.alAgno, tiendasParametros.delMes))}`}
          data={{
            labels: labels,
            datasets: datasets
          }}
        />
      </VentasTableContainer>
    </>
  )
}

Tiendas.getLayout = getVentasLayout;

export default Tiendas
