import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  InputToYear,
  SelectTiendasGeneral,
  Checkbox,
  InputYear,
  SelectToMonth,
} from "../../components/inputs";
import BarChart from "../../components/BarChart";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  getCurrentMonth,
  getCurrentYear,
  getMonthByNumber,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getAnualesPlazas } from "../../services/AnualesServices";
import {
  createDatasets,
  validateYearRange,
} from "../../utils/functions";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Plazas = (props) => {
  const {config} = props;
  const sendNotification = useNotification
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const [plazasParametros, setPlazasParametros] = useState({
    delAgno: getCurrentYear(),
    alAgno: getCurrentYear(),
    alMes: getCurrentMonth(),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1,
  });

  useEffect(()=>{
    setPlazasParametros(prev => ({
      ...prev,
      conIva: config?.conIva || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      conTiendasCerradas: config?.conTiendasCerradasa || 0,
      resultadosPesos: config?.resultadosPesos || 0,
    }))
  },[config])

  useEffect(() => {
    (async()=>{
      if(validateYearRange(plazasParametros.delAgno, plazasParametros.alAgno)){
        try {
          const response = await getAnualesPlazas(plazasParametros);
          createDatasets(
            response,
            plazasParametros.delAgno,
            plazasParametros.alAgno,
            setLabels,
            setDatasets
          );
        } catch (error) {
          sendNotification({
            type: 'ERROR',
            message: MENSAJE_ERROR,
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazasParametros]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas Plazas Acumuladas a ${getMonthByNumber(
          plazasParametros.alMes
        )} del año ${plazasParametros.delAgno} al año ${
          plazasParametros.alAgno
        }`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputYear
                value={plazasParametros.delAgno}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <InputToYear
                value={plazasParametros.alAgno}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <SelectToMonth
                value={plazasParametros.alMes}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <SelectTiendasGeneral
                value={plazasParametros.tiendas}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={plazasParametros.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={plazasParametros.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={plazasParametros.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                checked={plazasParametros.resultadosPesos ? true : false}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className=" p-4 overflow-y-auto ">
        <ComparativoVentas>
        <BarChart
            data={{
              labels: labels,
              datasets: datasets,
            }}
          />
        </ComparativoVentas>
      </section>
    </div>
  );
};

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
