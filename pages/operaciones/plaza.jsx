import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectPlazas,SelectMonth, SelectToMonth, InputYear, Checkbox } from '../../components/inputs';
import BarChart from '../../components/BarChart';
import { MessageModal } from '../../components/modals';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { createOperacionesDatasets, getInitialPlaza, getPlazaName, validateMonthRange, validateYear, isError } from '../../utils/functions';
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getOperacionesPlaza } from '../../services/OperacionesService';
import useMessageModal from '../../hooks/useMessageModal';
import useGraphData from '../../hooks/useGraphData';
import withAuth from '../../components/withAuth';
import { useUser } from '../../context/UserContext';

const Plaza = () => {
  const { plazas } = useUser();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(plazas),
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
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createOperacionesDatasets(response, paramPlaza.delAgno, setLabels, setDatasets);
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPlaza]);


  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
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
            Esta grafica muestra un comparativo de las ventas vs presupuesto del grupo en el periodo de meses y
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

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
