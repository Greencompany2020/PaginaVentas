import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  InputContainer,
  SelectMonth,
  InputToYear,
  SelectTiendasGeneral,
  Checkbox,
} from "../../components/inputs";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import BarChart from "../../components/BarChart";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  formatedDate,
  formatLastDate,
  getCurrentMonth,
  getCurrentYear,
  getMonthByNumber,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getMensualesTiendas } from "../../services/MensualesServices";
import {
  createSimpleDatasets,
  validateYear,
} from "../../utils/functions";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Tiendas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const [tiendasParametros, setTiendasParametros] = useState({
    delMes: getCurrentMonth(),
    alAgno: getCurrentYear(),
    tiendas: 0,
    conIva: config?.conIva || 0,
    conVentasEventos:  config?.conVentasEventos || 0,
    conTiendasCerradas:  config?.conTiendasCerradas || 0,
    resultadosPesos:  config?.resultadosPesos || 0,
  });

  
  useEffect(() => {
    (async()=>{
      if(validateYear(tiendasParametros.alAgno)){
        try {
          const response = await getMensualesTiendas(tiendasParametros)
          createSimpleDatasets(response, setLabels, setDatasets);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message:error.response.data.message || error.message
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros, tiendasParametros.alAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas del mes de ${getMonthByNumber(
          tiendasParametros.delMes
        )} del año ${tiendasParametros.alAgno}`}
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
                    value={tiendasParametros.delMes}
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
                labelText={checkboxLabels.VENTAS_IVA}
                checked={tiendasParametros.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={tiendasParametros.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
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
                onChange={(e) => handleChange(e, setTiendasParametros)}
                checked={tiendasParametros.resultadosPesos ? true : false}
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
                text={`Ventas al ${formatLastDate(
                  formatedDate(tiendasParametros.alAgno, tiendasParametros.delMes)
                )}`}
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

const TiendasWithAuth = withAuth(Tiendas);
TiendasWithAuth.getLayout = getVentasLayout;
export default TiendasWithAuth;
