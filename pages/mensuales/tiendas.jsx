import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { InputContainer, SelectMonth, InputToYear, SelectTiendasGeneral, Checkbox } from '../../components/inputs';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer } from '../../components/table';
import { MessageModal } from '../../components/modals';
import BarChart from '../../components/BarChart';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { formatedDate, formatLastDate, getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getMensualesTiendas } from '../../services/MensualesServices';
import { createSimpleDatasets, isError, validateYear } from '../../utils/functions';
import useMessageModal from '../../hooks/useMessageModal';
import useGraphData from '../../hooks/useGraphData';

const Tiendas = () => {
  const { message, modalOpen, setModalOpen, setMessage } = useMessageModal();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
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
    if (validateYear(tiendasParametros.alAgno)) {
      getMensualesTiendas(tiendasParametros)
        .then(response => {
          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createSimpleDatasets(response, setLabels, setDatasets)
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros]);

  return (
    <>
      <MessageModal setModalOpen={setModalOpen} message={message} modalOpen={modalOpen} />
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
