import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  Checkbox,
  SelectMonth,
  InputYear,
  SelectTiendasGeneral,
  InputToYear,
} from "../../components/inputs";
import BarChart from "../../components/BarChart";
import { checkboxLabels, MENSAJE_ERROR } from "../../utils/data";
import {
  formatedDate,
  formatLastDate,
  getCurrentMonth,
  getCurrentYear,
  getMonthByNumber,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { inputNames } from "../../utils/data/checkboxLabels";
import { getMensualesPlazasAgnos } from "../../services/MensualesServices";
import {
  createDatasets,
  validateYearRange,
} from "../../utils/functions";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const PlazasVS = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const [plazasAgnosParametros, setPlazasAgnosParametros] = useState({
    delMes: getCurrentMonth(),
    delAgno: getCurrentYear() - 1,
    alAgno: getCurrentYear(),
    tiendas: 0,
    conIva: config?.conIva || 0,
    conVentasEventos:config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    resultadosPesos: config?.resultadosPesos || 1,
  });

  useEffect(() => {
    (async()=>{
      if (validateYearRange(plazasAgnosParametros.delAgno,plazasAgnosParametros.alAgno)){
        try {
          const response = await getMensualesPlazasAgnos(plazasAgnosParametros);
          createDatasets(
            response,
            plazasAgnosParametros.delAgno,
            plazasAgnosParametros.alAgno,
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
  }, [plazasAgnosParametros, plazasAgnosParametros.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas del mes de ${getMonthByNumber(
          plazasAgnosParametros.delMes
        )} del ${plazasAgnosParametros.alAgno} al ${
          plazasAgnosParametros.delAgno
        }`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendasGeneral
                value={plazasAgnosParametros.tiendas}
                onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
              />
              <SelectMonth
                value={plazasAgnosParametros.delMes}
                onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
              />
              <div className="flex items-center space-x-1">
                <div className="flex-1">
                  <InputYear
                    value={plazasAgnosParametros.delAgno}
                    onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
                  />
                </div>
                <div className="flex-1">
                  <InputToYear
                    value={plazasAgnosParametros.alAgno}
                    onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
                  />
                </div>
              </div>
             
              
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={plazasAgnosParametros.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={plazasAgnosParametros.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={plazasAgnosParametros.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setPlazasAgnosParametros)}
                checked={plazasAgnosParametros.resultadosPesos ? true : false}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
       <ComparativoVentas>
       <BarChart
            text={`Ventas al ${formatLastDate(
              formatedDate(
                plazasAgnosParametros.alAgno,
                plazasAgnosParametros.delMes
              )
            )}`}
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

const PlazasVSWithAuth = withAuth(PlazasVS);
PlazasVSWithAuth.getLayout = getVentasLayout;
export default PlazasVSWithAuth;
