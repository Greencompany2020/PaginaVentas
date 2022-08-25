import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendas,
  SelectMonth,
  SelectToMonth,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import BarChart from "../../components/BarChart";
import { getPresupuestoTienda } from "../../services/PresupuestoService";
import { checkboxLabels, inputNames, MENSAJE_ERROR, plazas } from "../../utils/data";
import {
  getInitialTienda,
  validateMonthRange,
  validateYear,
  createPresupuestoDatasets,
  getTiendaName,
  isError,
} from "../../utils/functions";
import { getCurrentMonth, getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { useSelector } from "react-redux";

const Tienda = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const {shops} = useSelector(state => state);
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(shops),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    total: config?.total || 0,
    acumulado: config?.acumulado || 0,
    conIva: config?.conIva || 0,
    resultadosPesos: config?.resultadosPesos || 1,
  });

 
  useEffect(() => {
    (async()=>{
      if( validateMonthRange(paramTienda.delMes, paramTienda.alMes) &&  validateYear(paramTienda.delAgno) && shops){
        try {
          const response = await  getPresupuestoTienda(paramTienda);
          createPresupuestoDatasets(
            response,
            paramTienda.delAgno,
            setLabels,
            setDatasets
          );
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: error.response.data.message || error.message
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas por Mes Tienda ${getTiendaName(
          paramTienda.tienda
        )} del año ${paramTienda.delAgno}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={paramTienda.tienda}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <SelectMonth
                value={paramTienda.delMes}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <SelectToMonth
                value={paramTienda.alMes}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <InputYear
                value={paramTienda.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.ACUMULATIVA}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
                checked={paramTienda.acumulado}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.GRAFICAR_TOTAL}
                name={inputNames.GRAFICAR_TOTAL}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
                checked={paramTienda.total}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
                checked={paramTienda.conIva}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
                checked={paramTienda.resultadosPesos}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className=" pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        <ComparativoVentas>
          <BarChart
            data={{
              labels,
              datasets,
            }}
          />
        </ComparativoVentas>
      </section>
    </div>
  );
};

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
