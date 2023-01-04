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
import { checkboxLabels, inputNames } from "../../utils/data";
import {
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
import DateHelper from "../../utils/dateHelper";

const Plazas = (props) => {
  const { config } = props;
  const sendNotification = useNotification
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const date = DateHelper();
  const [plazasParametros, setPlazasParametros] = useState({
    delAgno: date.getCurrentYear() -  1,
    alAgno: date.getCurrentYear(),
    alMes: date.getcurrentMonth(),
    tiendas: 0,
    conIva: config?.conIva || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradasa || 0,
    resultadosPesos: config?.resultadosPesos || 0,
  });


  useEffect(() => {
    (async () => {
      if (validateYearRange(plazasParametros.delAgno, plazasParametros.alAgno)) {
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
            message: error.response.data.message || error.message
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
        )} del año ${plazasParametros.delAgno} al año ${plazasParametros.alAgno
          }`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendasGeneral
                value={plazasParametros.tiendas}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <SelectToMonth
                value={plazasParametros.alMes}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <div className="flex items-center space-x-1">
                <div className="flex-1">
                  <InputYear
                    value={plazasParametros.delAgno}
                    onChange={(e) => handleChange(e, setPlazasParametros)}
                  />
                </div>
                <div className="flex-1">
                  <InputToYear
                    value={plazasParametros.alAgno}
                    onChange={(e) => handleChange(e, setPlazasParametros)}
                  />
                </div>
              </div>

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
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        {
          datasets.length > 0 ?
            <ComparativoVentas>
              <BarChart
                data={{
                  labels: labels,
                  datasets: datasets,
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

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
