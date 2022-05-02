import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, SelectTiendasGeneral, Checkbox, InputToYear, SelectToMonth } from '../../components/inputs';
import { VentasTableContainer } from '../../components/table';
import BarChart from '../../components/BarChart';
import { MessageModal } from '../../components/modals';
import { checkboxLabels, MENSAJE_ERROR } from '../../utils/data';
import { formatedDate, formatLastDate, getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { inputNames } from '../../utils/data';
import { getAnualesTiendas } from '../../services/AnualesServices';
import { createSimpleDatasets, isError } from '../../utils/functions';
import useMessageModal from '../../hooks/useMessageModal';
import useGraphData from '../../hooks/useGraphData';
import withAuth from '../../components/withAuth';


const Tienda = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
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
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createSimpleDatasets(response, setLabels, setDatasets)
          }

        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
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
            datasets: datasets
          }}
        />
      </VentasTableContainer>
    </>
  )
}

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
