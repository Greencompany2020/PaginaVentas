import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectMonth,
  SelectToMonth,
  InputYear,
  SelectPlazas,
  Checkbox,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { checkboxLabels, inputNames} from "../../utils/data";
import BarChart from "../../components/BarChart";
import {
  getInitialPlaza,
  getPlazaName,
  validateMonthRange,
  validateYear,
  createPresupuestoDatasets,
} from "../../utils/functions";
import { handleChange } from "../../utils/handlers";
import { getPresupuestoPlazas } from "../../services/PresupuestoService";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { useSelector } from "react-redux";
import DateHelper from "../../utils/dateHelper";

const Plaza = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const {places} = useSelector(state => state);
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const date = DateHelper();
  const [paramPlazas, setParamPlazas] = useState({
    plaza: getInitialPlaza(places),
    delAgno: date.getCurrentYear(),
    delMes: 1,
    alMes: date.getcurrentMonth(),
    acumulado: config?.acumulado || 0,
    total: config?.total || 0,
    conIva: config?.conIva || 0,
    porcentajeVentasCompromiso: config?.porcentajeVentasCompromiso || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    resultadosPesos: config?.resultadosPesos || 0,
  });

  
  useEffect(() => {
    (async()=>{
      if( validateYear(paramPlazas.delAgno) &&  validateMonthRange(paramPlazas.delMes, paramPlazas.alMes) && places){
        try {
          const response = await getPresupuestoPlazas(paramPlazas);
          createPresupuestoDatasets(
            response,
            paramPlazas.delAgno,
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
  }, [paramPlazas]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas por Mes Tiendas Plaza ${getPlazaName(
          paramPlazas.plaza, places
        )} año ${paramPlazas.delAgno}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                value={paramPlazas.plaza}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <SelectMonth
                    value={paramPlazas.delMes}
                    onChange={(e) => {
                      handleChange(e, setParamPlazas);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <SelectToMonth
                    value={paramPlazas.alMes}
                    onChange={(e) => {
                      handleChange(e, setParamPlazas);
                    }}
                  />
                </div>
              </fieldset>

              <InputYear
                value={paramPlazas.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />

            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.ACUMULATIVA}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
                checked={paramPlazas.acumulado}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
                checked={paramPlazas.conIva}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.GRAFICAR_TOTAL}
                name={inputNames.GRAFICAR_TOTAL}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
                checked={paramPlazas.total}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_COMPROMISO}
                name={inputNames.PORCENTAJE_COMPROMISO}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
                checked={paramPlazas.porcentajeVentasCompromiso}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
                checked={paramPlazas.conVentasEventos}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
                checked={paramPlazas.conTiendasCerradas}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
                checked={paramPlazas.resultadosPesos}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        {
          datasets.length > 0 ?
            <ComparativoVentas>
              <BarChart
                data={{
                  labels,
                  datasets,
                }}
              />
            </ComparativoVentas>
            :
            <div className=" flex justify-center">
              <h4 className="text-xl">Consulta sin resultados</h4>
            </div>
        }
      </section>
    </div>
  );
};

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
