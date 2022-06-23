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
  SelectToMonth,
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

const Tienda = () => {
  const sendNotification = useNotification();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [tiendasParametros, setTiendasParametros] = useState({
    alAgno: getCurrentYear(),
    alMes: getCurrentMonth(),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1,
  });

  useEffect(() => {
    (async()=>{
      if(tiendasParametros.alAgno.toString().length === 4){
        try {
          const response = await getAnualesTiendas(tiendasParametros);
          createSimpleDatasets(response, setLabels, setDatasets);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            mesagge: response?.response?.data ?? MENSAJE_ERROR,
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
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputToYear
                value={tiendasParametros.alAgno}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <SelectToMonth
                value={tiendasParametros.alMes}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <SelectTiendasGeneral
                value={tiendasParametros.tiendas}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
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
