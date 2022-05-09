import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectTiendas,SelectMonth, SelectToMonth, InputYear, Checkbox } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import BarChart from '../../components/BarChart';
import { MessageModal } from '../../components/modals';
import { getPresupuestoTienda } from '../../services/PresupuestoService';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { getInitialTienda, validateMonthRange, validateYear, createPresupuestoDatasets, getTiendaName, isError } from '../../utils/functions'
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import useGraphData from '../../hooks/useGraphData';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';
import { useUser } from '../../context/UserContext';

const Tienda = () => {
  const { tiendas } = useUser();
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(tiendas),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    total: 0,
    acumulado: 0,
    total: 0,
    conIva: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateMonthRange(paramTienda.delMes, paramTienda.alMes) && validateYear(paramTienda.delAgno)) {
      getPresupuestoTienda(paramTienda)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createPresupuestoDatasets(response, paramTienda.delAgno, setLabels, setDatasets);
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda]);

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
            <InputYear 
              value={paramTienda.delAgno}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.ACUMULATIVA}
              name={inputNames.ACUMULATIVA}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.GRAFICAR_TOTAL}
              name={inputNames.GRAFICAR_TOTAL}
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
          Esta grafica muestra un comparativo de las ventas vs compromiso del grupo en el periodo de meses y
        </SmallContainer>
          <SmallContainer>
          el año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title={`Ventas por Mes Tienda ${getTiendaName(paramTienda.tienda)} del año ${paramTienda.delAgno}`}>
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

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
