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
  SelectTiendasGeneral,
  Checkbox,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import BarChart from "../../components/BarChart";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import { getCurrentMonth, getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import {
  validateMonthRange,
  validateYear,
  createPresupuestoDatasets,
} from "../../utils/functions";
import useGraphData from "../../hooks/useGraphData";
import { getPresupuestoGrupo } from "../../services/PresupuestoService";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Grupo = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramGrupo, setParamGrupo] = useState({
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    tiendas: 0,
    acumulado: 0,
    total: 0,
    conIva: 0,
    porcentajeVentasCompromiso: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0,
  });

  useEffect(()=>{
    setParamGrupo(prev => ({
      ...prev,
      acumulado: config?.acumulado || 0,
      total: config?.total || 0,
      conIva: config?.conIva || 0,
      porcentajeVentasCompromiso: config?.porcentajeVentasCompromiso || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      resultadosPesos: config?.resultadosPesos || 0,
    }))
  },[config])

  useEffect(() => {
    (async()=>{
      if(validateYear(paramGrupo.delAgno) && validateMonthRange(paramGrupo.delMes, paramGrupo.alMes)){
        try {
          const response = await getPresupuestoGrupo(paramGrupo);
          createPresupuestoDatasets(
            response,
            paramGrupo.delAgno,
            setLabels,
            setDatasets
          );
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramGrupo]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas vs. Compromiso del Grupo del año ${paramGrupo.delAgno}`}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectMonth
                value={paramGrupo.delMes}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
              <SelectToMonth
                value={paramGrupo.alMes}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
              <InputYear
                value={paramGrupo.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
               <SelectTiendasGeneral
                value={paramGrupo.tiendas}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.ACUMULATIVA}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.acumulado}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.GRAFICAR_TOTAL}
                name={inputNames.GRAFICAR_TOTAL}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.total}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.conIva}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_COMPROMISO}
                name={inputNames.PORCENTAJE_COMPROMISO}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.porcentajeVentasCompromiso}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.conVentasEventos}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.conTiendasCerradas}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.resultadosPesos}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
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

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
