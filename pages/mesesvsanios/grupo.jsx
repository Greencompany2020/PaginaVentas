import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import BarChart from "../../components/BarChart";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectMonth,
  SelectTiendasGeneral,
  InputYear,
  Checkbox,
  InputToYear,
  SelectToMonth,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  formatLastDate,
  getCurrentMonth,
  getCurrentYear,
  getPrevDate,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getMesesAgnosGrupo } from "../../services/MesesAgnosService";
import useGraphData from "../../hooks/useGraphData";
import {
  createMesesAgnosGrupoDataset,
  validateMonthRange,
  validateYearRange,
} from "../../utils/functions";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import DateHelper from "../../utils/dateHelper";

const Grupo = (props) => {
  const {config} = props;
  const sendNotification  = useNotification();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const date = DateHelper();
  const [parametrosGrupo, setParametrosGrupo] = useState({
    delAgno: date.getCurrentYear() - 1,
    alAgno: date.getCurrentYear(),
    delMes: date.getcurrentMonth(),
    alMes: date.getNextMonth(),
    tiendas: 0,
    incluirTotal: config?.incluirTotal || 0,
    ventasDiaMesActual: config?.ventasDiaMesActual || 0,
    conIva: config?.conIva || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    sinAgnoVenta: config?.sinAgnoVenta || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
  });


  useEffect(() => {
    (async()=>{
      if(validateYearRange(parametrosGrupo.delAgno, parametrosGrupo.alAgno) 
        && validateMonthRange(parametrosGrupo.delMes, parametrosGrupo.alMes)){
          try {
            const response = await getMesesAgnosGrupo(parametrosGrupo);
            createMesesAgnosGrupoDataset(
              response,
              parametrosGrupo.delAgno,
              parametrosGrupo.alAgno,
              setDatasets,
              setLabels
            );
          } catch (error) {
            sendNotification({
              type:'ERROR',
              message:error.response.data.message || error.message
            });
          }
        }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosGrupo, parametrosGrupo.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Comparativo de ventas del año ${parametrosGrupo.delAgno} al año ${parametrosGrupo.alAgno} (mls.dlls)`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <InputYear
                    value={parametrosGrupo.delAgno}
                    onChange={(e) => {
                      handleChange(e, setParametrosGrupo);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <InputToYear
                    value={parametrosGrupo.alAgno}
                    onChange={(e) => {
                      handleChange(e, setParametrosGrupo);
                    }}
                  />
                </div>
              </fieldset>
             
              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <SelectMonth
                    value={parametrosGrupo.delMes}
                    onChange={(e) => {
                    handleChange(e, setParametrosGrupo);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <SelectToMonth
                    value={parametrosGrupo.alMes}
                    onChange={(e) => {
                    handleChange(e, setParametrosGrupo);
                    }}
                  />
                </div>
              </fieldset>
              
               
              <SelectTiendasGeneral 
                value={parametrosGrupo.tiendas}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo)
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TOTAL}
                name={inputNames.INCLUIR_TOTAL}
                checked={parametrosGrupo.incluirTotal ? true : false}
                onChange={(e) => {handleChange(e, setParametrosGrupo)}}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
                checked={parametrosGrupo.ventasDiaMesActual ? true : false}
                name={inputNames.VENTAS_DIA_MES_ACTUAL}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={parametrosGrupo.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => {handleChange(e, setParametrosGrupo)}}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={parametrosGrupo.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {handleChange(e, setParametrosGrupo)}}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                checked={parametrosGrupo.sinAgnoVenta ? true : false}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => {handleChange(e, setParametrosGrupo)}}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={parametrosGrupo.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {handleChange(e, setParametrosGrupo)}}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                checked={parametrosGrupo.sinTiendasSuspendidas ? true : false}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                onChange={(e) => {handleChange(e, setParametrosGrupo)}}
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
                text={`${parametrosGrupo.alMes === getCurrentMonth()
                    ? `Ventas al ${formatLastDate(
                      getPrevDate(0, parametrosGrupo.alAgno)
                    )}`
                    : ""
                  }`}
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
