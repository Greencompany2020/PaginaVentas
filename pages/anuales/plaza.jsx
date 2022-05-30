import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, InputToYear, SelectTiendasGeneral, Checkbox, InputYear, SelectToMonth } from '../../components/inputs';
import { VentasTableContainer } from '../../components/table';
import BarChart from '../../components/BarChart';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getAnualesPlazas } from '../../services/AnualesServices';
import { createDatasets, isError, validateYearRange } from '../../utils/functions';
import useGraphData from '../../hooks/useGraphData';
import withAuth from '../../components/withAuth';
import {useAlert} from '../../context/alertContext';
import TitleReport from '../../components/TitleReport';


const Plazas = () => {
  const alert = useAlert();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const [plazasParametros, setPlazasParametros] = useState({
    delAgno: getCurrentYear() - 4,
    alAgno: getCurrentYear(),
    alMes: getCurrentMonth(),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1
  });

  useEffect(() => {
    if (validateYearRange(plazasParametros.delAgno, plazasParametros.alAgno)) {
      getAnualesPlazas(plazasParametros)
        .then(response => {

          if (isError(response)) {
            alert.showAlert(response?.response?.data ?? MENSAJE_ERROR, 'warning', 1000)
          } else {
            createDatasets(
              response,
              plazasParametros.delAgno,
              plazasParametros.alAgno,
              setLabels,
              setDatasets
            )
          }

      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazasParametros]);

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear
              value={plazasParametros.delAgno}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
            <InputToYear
              value={plazasParametros.alAgno}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <SelectToMonth
              value={plazasParametros.alMes}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
            <SelectTiendasGeneral
              value={plazasParametros.tiendas}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              checked={plazasParametros.resultadosPesos ? true : false}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
          </InputContainer>
        </Parameters>
      </ParametersContainer>

      <TitleReport 
        title={`Ventas Plazas Acumuladas a ${getMonthByNumber(plazasParametros.alMes)} del año ${plazasParametros.delAgno} al año ${plazasParametros.alAgno}`}
        description = {`Esta gráfica muestra las ventas anuales por plaza seguna el rango de años especificado.
        Recuerde que el rango de años debe ser capturado de el menor a el mayor, aunque en el reporte se mostrarara el orden descendiente.
        `}
      />

      <VentasTableContainer>
        <BarChart
          data={{
            labels: labels,
            datasets: datasets
          }}
        />
      </VentasTableContainer>
    </>
  )
}

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
