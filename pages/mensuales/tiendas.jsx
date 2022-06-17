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
  isError,
  validateYear,
} from "../../utils/functions";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";
import ComparativoVentas from "../../components/table/ComparativoVentas";

const Tiendas = () => {
  const alert = useAlert();
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const [tiendasParametros, setTiendasParametros] = useState({
    delMes: getCurrentMonth(),
    alAgno: getCurrentYear(),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1,
  });

  useEffect(() => {
    if (validateYear(tiendasParametros.alAgno)) {
      getMensualesTiendas(tiendasParametros).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          createSimpleDatasets(response, setLabels, setDatasets);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros, tiendasParametros.alAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas del mes de ${getMonthByNumber(
          tiendasParametros.delMes
        )} del año ${tiendasParametros.alAgno}`}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectMonth
                value={tiendasParametros.delMes}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <InputToYear
                value={tiendasParametros.alAgno}
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
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
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
                onChange={(e) => handleChange(e, setTiendasParametros)}
                checked={tiendasParametros.resultadosPesos ? true : false}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
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
      </section>
    </div>
  );
};

const TiendasWithAuth = withAuth(Tiendas);
TiendasWithAuth.getLayout = getVentasLayout;
export default TiendasWithAuth;
