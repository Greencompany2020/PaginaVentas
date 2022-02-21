import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer } from '../../components/table';
import { InputContainer, Checkbox, SelectMonth, InputYear, SelectTiendasGeneral, InputToYear } from '../../components/inputs';
import BarChart from '../../components/BarChart';
import { checkboxLabels } from '../../utils/data';
import { formatedDate, formatLastDate, getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { inputNames } from '../../utils/data/checkboxLabels';
import { getMensualesPlazasAgnos } from '../../services/MensualesServices';
import { dateRangeTitle } from '../../utils/functions';
import { format } from 'date-fns';

const PlazasVS = () => {
  const colors = ['#9a3412', '#9a3412', '#3f6212', '#065f46', '#155e75'];
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [plazasAgnosParametros, setPlazasAgnosParametros] = useState({
    delMes: getCurrentMonth(),
    delAgno: getCurrentYear() - 4,
    alAgno: getCurrentYear(),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1
  });

  useEffect(() => {
    if (plazasAgnosParametros.delAgno.toString().length === 4 && plazasAgnosParametros.alAgno.toString().length === 4) {
      getMensualesPlazasAgnos(plazasAgnosParametros)
        .then(response => createDatasets(response))
    }
  }, [plazasAgnosParametros]);

  const createDatasets = (data) => {
    if (data.length !== 0) {
      let labels = [];
      labels = data.map(item => item.DescGraf);
      setLabels(labels);

      let datasets = [];
      let colorIndex = 0;
      let dataSetIndex = 1;
      for (let i = plazasAgnosParametros.alAgno; i >= plazasAgnosParametros.delAgno; i--) {

        datasets.push({
          id: dataSetIndex,
          label: `${i}`,
          data: data.map(item => item[`Venta${i}`]),
          backgroundColor: colors[colorIndex]
        });

        colorIndex++;
        dataSetIndex++;

        if (colorIndex === colors.length) {
          colorIndex = 0;
        }
      }

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
              value={plazasAgnosParametros.delMes}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
            />
            <InputYear
              value={plazasAgnosParametros.delAgno}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
            />
            <InputToYear
              value={plazasAgnosParametros.alAgno}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
            />
          </InputContainer>
          <InputContainer>
            <SelectTiendasGeneral
              value={plazasAgnosParametros.tiendas}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
              checked={plazasAgnosParametros.resultadosPesos ? true : false}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta gráfica muestra las ventas por plaza del mes seleccionado en el rango de años especificado.
        </SmallContainer>
        <SmallContainer>
          Recuerde que el rango de años debe ser capturado de menor a el mayor, aunque en el reporte se mostrara en orden descendente.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer
        title={`Ventas del mes de ${getMonthByNumber(plazasAgnosParametros.delMes)} del ${plazasAgnosParametros.alAgno} al ${plazasAgnosParametros.delAgno}`}
      >
        <BarChart
          text={`Ventas al ${formatLastDate(formatedDate(plazasAgnosParametros.alAgno, plazasAgnosParametros.delMes))
            }`}
          data={{
            labels: labels,
            datasets: datasets
          }}
        />
      </VentasTableContainer>
    </>
  )
}

PlazasVS.getLayout = getVentasLayout;

export default PlazasVS
