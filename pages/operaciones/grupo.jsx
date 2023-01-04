import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
  SelectMonth,
  SelectToMonth,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import BarChart from "../../components/BarChart";
import { checkboxLabels, inputNames} from "../../utils/data";
import { handleChange } from "../../utils/handlers";
import {
  createOperacionesDatasets,
  validateMonthRange,
  validateYear,
} from "../../utils/functions";
import { getOperacionesGrupo } from "../../services/OperacionesService";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import DateHelper from "../../utils/dateHelper";

const Grupo = (props) => {
  const {config} = props;
  const date = DateHelper();
  const sendNotification = useNotification();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramGrupo, setParamGrupo] = useState({
    delMes: 1,
    alMes: date.getcurrentMonth(),
    delAgno: date.getCurrentYear(),
    conIva: config?.conIva || 0,
    tiendas: config?.tiendas || 0,
    promedio: config?.promedio || 0,
    acumulado: config?.acumulado || 0,
    conEventos: config?.conEventos || 0,
    resultadosPesos: config?.resultadosPesos || 0,
  });

  
  useEffect(() => {
    (async()=>{
      if(validateMonthRange(paramGrupo.delMes, paramGrupo.alMes) &&  validateYear(paramGrupo.delAgno)){
        try {
          const response = await getOperacionesGrupo(paramGrupo);
          createOperacionesDatasets(
            response,
            paramGrupo.delAgno,
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
  }, [paramGrupo, paramGrupo.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Operaciones por Mes del Grupo del año ${paramGrupo.delAgno}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendasGeneral
                value={paramGrupo.tiendas}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <SelectMonth
                    value={paramGrupo.delMes}
                    onChange={(e) => {
                      handleChange(e, setParamGrupo);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <SelectToMonth
                    value={paramGrupo.alMes}
                    onChange={(e) => {
                      handleChange(e, setParamGrupo);
                    }}
                  />
                </div>
              </fieldset>


              <InputYear
                value={paramGrupo.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />

            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PROMEDIO}
                name={inputNames.PROMEDIO}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.promedio}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_ACUMULADO}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.acumulado}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_EVENTOS}
                name={inputNames.CON_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.conEventos}
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

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
