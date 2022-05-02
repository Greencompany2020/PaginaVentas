import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectTiendasGeneral,SelectMonth, SelectToMonth, InputYear, Checkbox } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import BarChart from '../../components/BarChart';
import { MessageModal } from '../../components/modals';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { createOperacionesDatasets, isError, validateMonthRange, validateYear } from '../../utils/functions';
import { getOperacionesGrupo } from '../../services/OperacionesService';
import useGraphData from '../../hooks/useGraphData';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';

const Grupo = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramGrupo, setParamGrupo] = useState({
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    conIva: 0,
    tiendas: 0,
    promedio: 0,
    acumulado: 0,
    conEventos: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateMonthRange(paramGrupo.delMes, paramGrupo.alMes) && validateYear(paramGrupo.delAgno)) {
      getOperacionesGrupo(paramGrupo)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createOperacionesDatasets(response, paramGrupo.delAgno, setLabels, setDatasets);
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramGrupo]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth
              value={paramGrupo.delMes}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <SelectToMonth
              value={paramGrupo.alMes}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <InputYear
              value={paramGrupo.delAgno}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <SelectTiendasGeneral
              value={paramGrupo.tiendas}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.PROMEDIO}
              name={inputNames.PROMEDIO}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_ACUMULADO}
              name={inputNames.ACUMULATIVA}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_EVENTOS}
              name={inputNames.CON_EVENTOS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
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

      <ComparativoVentas 
        title={`Operaciones por Mes del Grupo del año ${paramGrupo.delAgno}`}
      >
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

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;