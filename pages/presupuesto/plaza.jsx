import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectMonth,
  SelectToMonth,
  InputYear,
  SelectPlazas,
  Checkbox,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import BarChart from "../../components/BarChart";
import {
  getInitialPlaza,
  getPlazaName,
  validateMonthRange,
  validateYear,
  createPresupuestoDatasets,
  isError,
} from "../../utils/functions";
import { getCurrentMonth, getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getPresupuestoPlazas } from "../../services/PresupuestoService";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Plaza = () => {
  const alert = useAlert();
  const { plazas } = useUser();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramPlazas, setParamPlazas] = useState({
    plaza: getInitialPlaza(plazas),
    delAgno: getCurrentYear(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    acumulado: 0,
    total: 0,
    conIva: 0,
    porcentajeVentasCompromiso: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0,
  });

  useEffect(() => {
    if (
      validateYear(paramPlazas.delAgno) &&
      validateMonthRange(paramPlazas.delMes, paramPlazas.alMes)
    ) {
      getPresupuestoPlazas(paramPlazas).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          createPresupuestoDatasets(
            response,
            paramPlazas.delAgno,
            setLabels,
            setDatasets
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPlazas]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas por Mes Tiendas Plaza ${getPlazaName(
          paramPlazas.plaza
        )} año ${paramPlazas.delAgno}`}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectMonth
                value={paramPlazas.delMes}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <SelectToMonth
                value={paramPlazas.alMes}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <InputYear
                value={paramPlazas.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
            </InputContainer>
            <InputContainer>
              <SelectPlazas
                value={paramPlazas.plaza}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.ACUMULATIVA}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.GRAFICAR_TOTAL}
                name={inputNames.GRAFICAR_TOTAL}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_COMPROMISO}
                name={inputNames.PORCENTAJE_COMPROMISO}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamPlazas);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
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
