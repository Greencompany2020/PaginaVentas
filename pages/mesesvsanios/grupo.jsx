import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import BarChart from "../../components/BarChart";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
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
  isError,
  validateMonthRange,
  validateYearRange,
} from "../../utils/functions";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Grupo = () => {
  const alert = useAlert();
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

  useEffect(() => {
    if (
      validateYearRange(parametrosGrupo.delAgno, parametrosGrupo.alAgno) &&
      validateMonthRange(parametrosGrupo.delMes, parametrosGrupo.alMes)
    ) {
      getMesesAgnosGrupo(parametrosGrupo).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          createMesesAgnosGrupoDataset(
            response,
            parametrosGrupo.delAgno,
            parametrosGrupo.alAgno,
            setDatasets,
            setLabels
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosGrupo]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Comparativo de ventas del año ${parametrosGrupo.delAgno} al año ${parametrosGrupo.alAgno} (mls.dlls)`}
        description={`Esta gráfica muestra las ventas anuales del grupo para cada uno de los años del rango especificado. 
          Recuerde que el rango de años debe ser capturado de el menor a el mayor aunque en el reporte se mostrará en orden descendente.
          `}
      />

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
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
            </InputContainer>
            <InputContainer>
              <SelectToMonth
                value={parametrosGrupo.alMes}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
              <SelectTiendasGeneral />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TOTAL}
                name={inputNames.INCLUIR_TOTAL}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
                name={inputNames.VENTAS_DIA_MES_ACTUAL}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                onChange={(e) => {
                  handleChange(e, setParametrosGrupo);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
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
