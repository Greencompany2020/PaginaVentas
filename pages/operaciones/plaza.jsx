import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectPlazas,
  SelectMonth,
  SelectToMonth,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import BarChart from "../../components/BarChart";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  createOperacionesDatasets,
  getInitialPlaza,
  getPlazaName,
  validateMonthRange,
  validateYear,
} from "../../utils/functions";
import { getCurrentMonth, getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getOperacionesPlaza } from "../../services/OperacionesService";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { useSelector } from "react-redux";

const Plaza = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const {places} = useSelector(state => state);
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(places),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    promedio: config?.promedio || 0,
    acumulado: config?.acumulado || 0,
    conIva: config?.conIva || 0,
    ventasMilesDlls: config?.ventasMilesDlls || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    resultadosPesos: config?.resultadosPesos || 1,
  });

 
  useEffect(() => {
    (async()=>{
      if(validateMonthRange(paramPlaza.delMes, paramPlaza.alMes) && validateYear(paramPlaza.delAgno) && places){
        try {
          const response = await getOperacionesPlaza(paramPlaza);
          createOperacionesDatasets(
            response,
            paramPlaza.delAgno,
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
  }, [paramPlaza, paramPlaza.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Operaciones realizadas Plaza ${getPlazaName(
          paramPlaza.plaza
        )} ${paramPlaza.delAgno}`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                value={paramPlaza.plaza}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <SelectMonth
                    value={paramPlaza.delMes}
                    onChange={(e) => {
                      handleChange(e, setParamPlaza);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <SelectToMonth
                    value={paramPlaza.alMes}
                    onChange={(e) => {
                      handleChange(e, setParamPlaza);
                    }}
                  />
                </div>
              </fieldset>


              <InputYear
                value={paramPlaza.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PROMEDIO}
                name={inputNames.PROMEDIO}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.promedio}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_ACUMULADO}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.acumulado}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.conIva}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.OPERACIONES_EN_MILES}
                name={inputNames.VENTAS_MILES_DLLS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.ventasMilesDlls}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.conVentasEventos}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.conTiendasCerradas}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.resultadosPesos}
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

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
