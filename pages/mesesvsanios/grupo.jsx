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

const Grupo = (props) => {
  const {config} = props;
  const sendNotification  = useNotification();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const [parametrosGrupo, setParametrosGrupo] = useState({
    delAgno: getCurrentYear() - 5,
    alAgno: getCurrentYear(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    tiendas: 0,
    incluirTotal: 0,
    ventasDiaMesActual: 0,
    conIva: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 0,
  });

  useEffect(()=>{
    setParametrosGrupo(prev => ({
      ...prev,
      incluirTotal: config?.incluirTotal || 0,
      ventasDiaMesActual: config?.ventasDiaMesActual || 0,
      conIva: config?.conIva || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      sinAgnoVenta: config?.sinAgnoVenta || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
    }));
  },[config])

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
              message:response?.response?.data ?? MENSAJE_ERROR
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
              <InputYear
                value={parametrosGrupo.delAgno}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
              <InputToYear
                value={parametrosGrupo.alAgno}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
              <SelectMonth
                value={parametrosGrupo.delMes}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
               <SelectToMonth
                value={parametrosGrupo.alMes}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
              <SelectTiendasGeneral />
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
        <ComparativoVentas>
          <BarChart
            text={`${
              parametrosGrupo.alMes === getCurrentMonth()
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
      </section>
    </div>
  );
};

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
