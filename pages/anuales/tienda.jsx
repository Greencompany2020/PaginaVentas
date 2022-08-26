import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
  Checkbox,
  InputToYear,
  SelectMonth,
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
import { inputNames } from "../../utils/data";
import { getAnualesTiendas } from "../../services/AnualesServices";
import { createSimpleDatasets, isError } from "../../utils/functions";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Tienda = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [tiendasParametros, setTiendasParametros] = useState({
    alAgno: getCurrentYear(),
    alMes: getCurrentMonth(),
    tiendas: 0,
    conIva: config?.conIva || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    resultadosPesos: config?.resultadosPesos || 1,
  });


  useEffect(() => {
    (async()=>{
      if(tiendasParametros.alAgno.toString().length === 4){
        const {delAgno, ...rest} = tiendasParametros;
        try {
          const response = await getAnualesTiendas(rest);
          createSimpleDatasets(response, setLabels, setDatasets);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            mesagge: error.response.data.message || error.message
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros]);
  

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas Acumuladas a ${getMonthByNumber(
          tiendasParametros.alMes
        )} del ${tiendasParametros.alAgno}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendasGeneral
                value={tiendasParametros.tiendas}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <div className="flex items-center space-x-1">
                <div className="flex-1">
                  <SelectMonth
                    value={tiendasParametros.alMes}
                    onChange={(e) => handleChange(e, setTiendasParametros)}
                  />
                </div>
                <div className="flex-1">
                  <InputToYear
                    value={tiendasParametros.alAgno}
                    onChange={(e) => handleChange(e, setTiendasParametros)}
                  />
                </div>
              </div>
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={tiendasParametros.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={tiendasParametros.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={tiendasParametros.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                checked={tiendasParametros.resultadosPesos ? true : false}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        <ComparativoVentas>
        <BarChart
            text={`Ventas al ${formatLastDate(
              formatedDate(tiendasParametros.alAgno, tiendasParametros.alMes)
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

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
