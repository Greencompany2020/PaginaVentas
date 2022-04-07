import { useState, useEffect } from 'react';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { Checkbox, InputContainer, InputToYear, InputYear, SelectMonth, SelectTiendas, SelectToMonth } from '../../components/inputs';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { getOperacionesTienda } from '../../services/OperacionesService';
import { MessageModal } from '../../components/modals';
import BarChart from '../../components/BarChart';
import { checkboxLabels, inputNames, MENSAJE_ERROR, meses } from '../../utils/data';
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { getInitialTienda, getTiendaName, isError, validateMonthRange, validateYearRange } from '../../utils/functions';
import { handleChange } from '../../utils/handlers';
import useGraphData from '../../hooks/useGraphData';
import useMessageModal from '../../hooks/useMessageModal';

const Tienda = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear() - 1,
    alAgno: getCurrentYear(),
    promedio: 0,
    acumulado: 0,
    conIva: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateYearRange(paramTienda.delAgno, paramTienda.alAgno) && validateMonthRange(paramTienda.delMes, paramTienda.alMes)) {
      getOperacionesTienda(paramTienda)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true)
          } else {
            createOperacionesDatasets(response)
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda]);

  const createOperacionesDatasets = (data) => {
    const colors = ['#047857', '#0E7490', '#1D4ED8', '#4338ca', '#6d28d9', '#be185d'];
  
    if (data?.length !== 0) {
      const labels = [];
      const operacionesDataset = [];
  
      for (let operacion of data) {
        const month = meses.find((mes) => mes.value === operacion.mes)?.text ?? "ACUM";
  
        const label = `${month} ${operacion.porcentaje}%`;
  
        labels.push(label);
      }
  
      let colorIndex = 0;

      for (let i = paramTienda.alAgno; i >= paramTienda.delAgno; i--) {
        let operaciones = data?.map((operacion) => operacion[`operaciones${i}`]);

        const operacionesData = {
          label: `Operaciones ${i}`,
          data: operaciones,
          backgroundColor: colors[colorIndex]
        };
    
        operacionesDataset.push(operacionesData);

        colorIndex++;
        
        if (colorIndex === colors.length) {
          colorIndex = 0;
        }
      }
  
      setDatasets(operacionesDataset)
      setLabels(labels);
    } else {
      setDatasets([]);
      setLabels([]);
    }
  }

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
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
          </InputContainer>
          <InputContainer>
            <InputYear
              value={paramTienda.delAgno}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <InputToYear 
              value={paramTienda.alAgno}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.PROMEDIO}
              name={inputNames.PROMEDIO}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_ACUMULADO}
              name={inputNames.ACUMULATIVA}
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
          ESTA GRAFICA MUESTRA LAS OPERACIONES REALIZADAS POR LA TIENDA SELECCIONADA EN EL PERIODO DE MESES 
        </SmallContainer>
        <SmallContainer>
          Y EL AÑO ESPECIFICADO, ESTE SIEMPRE SERA COMPARADO CONTRA EL AÑO ANTERIOR.
        </SmallContainer>
      </ParametersContainer>

      <ComparativoVentas
        title={`Operaciones Realizadas Tienda ${getTiendaName(paramTienda.tienda)} ${paramTienda.alAgno} ${paramTienda.delAgno}`}
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

Tienda.getLayout = getVentasLayout;

export default Tienda
