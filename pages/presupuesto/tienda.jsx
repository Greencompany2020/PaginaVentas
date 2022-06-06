import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendas,
  SelectMonth,
  SelectToMonth,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import BarChart from "../../components/BarChart";
import { getPresupuestoTienda } from "../../services/PresupuestoService";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  getInitialTienda,
  validateMonthRange,
  validateYear,
  createPresupuestoDatasets,
  getTiendaName,
  isError,
} from "../../utils/functions";
import { getCurrentMonth, getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Tienda = () => {
  const alert = useAlert();
  const { tiendas } = useUser();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(tiendas),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    total: 0,
    acumulado: 0,
    total: 0,
    conIva: 0,
    resultadosPesos: 0,
  });

  useEffect(() => {
    if (
      validateMonthRange(paramTienda.delMes, paramTienda.alMes) &&
      validateYear(paramTienda.delAgno)
    ) {
      getPresupuestoTienda(paramTienda).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          createPresupuestoDatasets(
            response,
            paramTienda.delAgno,
            setLabels,
            setDatasets
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas por Mes Tienda ${getTiendaName(
          paramTienda.tienda
        )} del año ${paramTienda.delAgno}`}
        description={`Esta grafica muestra un comparativo de las ventas vs compromiso del grupo en el periodo de meses y
        el año especificado, este siempre será comparado contra el año anterior.
        `}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={paramTienda.tienda}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <SelectMonth
                value={paramTienda.delMes}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <SelectToMonth
                value={paramTienda.alMes}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <InputYear
                value={paramTienda.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.ACUMULATIVA}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.GRAFICAR_TOTAL}
                name={inputNames.GRAFICAR_TOTAL}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className=" pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
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

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
