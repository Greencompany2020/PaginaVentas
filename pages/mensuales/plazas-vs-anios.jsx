import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer } from '../../components/table';
import { InputContainer, Checkbox, SelectMonth, InputYear, SelectTiendasGeneral, InputToYear } from '../../components/inputs';
import BarChart from '../../components/BarChart';
import MessageModal from '../../components/MessageModal';
import { checkboxLabels, MENSAJE_ERROR } from '../../utils/data';
import { formatedDate, formatLastDate, getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { inputNames } from '../../utils/data/checkboxLabels';
import { getMensualesPlazasAgnos } from '../../services/MensualesServices';
import { createDatasets, isError, validateYearRange } from '../../utils/functions';
import useMessageModal from '../../hooks/useMessageModal';
import useGraphData from '../../hooks/useGraphData';


const PlazasVS = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
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
    if (validateYearRange(plazasAgnosParametros.delAgno, plazasAgnosParametros.alAgno)) {
      getMensualesPlazasAgnos(plazasAgnosParametros)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true)
          } else {
              createDatasets(
              response,
              plazasAgnosParametros.delAgno,
              plazasAgnosParametros.alAgno,
              setLabels,
              setDatasets
            )
          }

      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazasAgnosParametros]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
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
