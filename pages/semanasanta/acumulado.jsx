import { useState, useEffect, Fragment } from "react";
import {
  SmallContainer,
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import {
  InputContainer,
  Checkbox,
  InputOfTheDate,
  InputVsYear,
} from "../../components/inputs";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  getCurrentDate,
  getCurrentYear,
  getYearFromDate,
  semanaSanta,
} from "../../utils/dateFunctions";
import {
  getDayName,
  rowColor,
  validateDate,
  validateYear,
  getTableName,
  dateRangeTitleSemanaSanta,
  isError,
} from "../../utils/functions";
import { handleChange } from "../../utils/handlers";
import { getSemanaSantaAcumulado } from "../../services/semanaSantaService";
import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Acumulado = () => {
  const alert = useAlert();
  const [fechaInicioSemana, setFechaInicioSemana] = useState(
    semanaSanta(getCurrentYear())[0]
  );
  const [acumulado, setAcumulado] = useState([]);
  const [paramAcumulado, setParamAcumulado] = useState({
    fecha: getCurrentDate(true),
    versusAgno: getCurrentYear() - 1,
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    incluirFinSemanaAnterior: 1,
    resultadosPesos: 1,
  });
  const [finSemana, setFinSemana] = useState(
    paramAcumulado.incluirFinSemanaAnterior ? true : false
  );

  useEffect(() => {
    if (
      validateDate(paramAcumulado.fecha) &&
      validateYear(paramAcumulado.versusAgno)
    ) {
      getSemanaSantaAcumulado(paramAcumulado).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setAcumulado(response);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramAcumulado]);

  useEffect(() => {
    setFechaInicioSemana(
      semanaSanta(getYearFromDate(paramAcumulado.fecha), false, finSemana)[0]
    );
  }, [finSemana, paramAcumulado.fecha]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas Semana Santa del año ${getYearFromDate(
          paramAcumulado.fecha
        )}`}
        description=" Este reporte muestra la venta del dia y la venta acumulada de la semana santa en la fecha especificada."
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputOfTheDate
                value={paramAcumulado.fecha}
                onChange={(e) => {
                  handleChange(e, setParamAcumulado);
                  setFechaInicioSemana(
                    semanaSanta(
                      getYearFromDate(paramAcumulado.fecha),
                      false,
                      false
                    )[0]
                  );
                }}
              />
              <InputVsYear
                value={paramAcumulado.versusAgno}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_LOGRO}
                name={inputNames.PORCENTAJE_COMPROMISO}
                onChange={(e) => handleChange(e, setParamAcumulado)}
                checked={paramAcumulado.porcentajeVentasCompromiso}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}
                name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}
                onChange={(e) => {
                  handleChange(e, setParamAcumulado);
                  setFinSemana((prev) => !prev);
                }}
                checked={paramAcumulado.incluirFinSemanaAnterior}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setParamAcumulado)}
                checked={paramAcumulado.resultadosPesos}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer>
          {Object.entries(acumulado).map(([key, value]) => (
            <Fragment key={key}>
              {getTableName(key)}
              <VentasTable className="last-row-bg">
                <TableHead>
                  <tr>
                    <td rowSpan={3} className="border border-white">
                      Tienda
                    </td>
                    <td colSpan={10} className="border border-white">
                      {getDayName(paramAcumulado.fecha)}
                    </td>
                    <td colSpan={4} className="border border-white">
                      {dateRangeTitleSemanaSanta(
                        fechaInicioSemana,
                        paramAcumulado.fecha
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="border border-white">
                      Venta
                    </td>
                    <td colSpan={3} className="border border-white">
                      Promedio
                    </td>
                    <td colSpan={3} className="border border-white">
                      Operaciones
                    </td>
                    <td colSpan={4} className="border border-white">
                      Venta
                    </td>
                  </tr>
                  <tr>
                    <td rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      PPTO.
                    </td>
                    <td rowSpan={2} className="border border-white">
                      %
                    </td>
                    <td rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      %
                    </td>
                    <td rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      %
                    </td>
                    <td rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </td>
                    <td rowSpan={2} className="border border-white">
                      PPTO.
                    </td>
                    <td rowSpan={3} className="border border-white">
                      %
                    </td>
                  </tr>
                </TableHead>
                <tbody className="bg-white text-center">
                  {value?.map((venta) => (
                    <TableRow
                      key={venta.tienda}
                      rowId={venta.tienda}
                      className={rowColor(venta)}
                    >
                      <td className="text-sm">{venta.tienda}</td>
                      <td className="font-bold">
                        {numberWithCommas(venta.ventaActual)}
                      </td>
                      <td className="text-sm">
                        {numberWithCommas(venta.ventaAnterior)}
                      </td>
                      <td className="text-sm">
                        {numberWithCommas(venta.presupuesto)}
                      </td>
                      {formatNumber(venta.porcentaje)}
                      <td className="font-bold">
                        {numberWithCommas(venta.promedioActual)}
                      </td>
                      <td className="text-sm">
                        {numberWithCommas(venta.promedioAnterior)}
                      </td>
                      {formatNumber(venta.porcentajePromedios)}
                      <td className="font-bold">
                        {numberWithCommas(venta.operacionesActual)}
                      </td>
                      <td className="text-sm">
                        {numberWithCommas(venta.operacionesAnterior)}
                      </td>
                      {formatNumber(venta.porcentajeOperaciones)}
                      <td className="font-bold">
                        {numberWithCommas(venta.ventaAcumuladaActual)}
                      </td>
                      <td className="text-sm">
                        {numberWithCommas(venta.ventaAcumuladaAnterior)}
                      </td>
                      <td className="text-sm">
                        {numberWithCommas(venta.presupuestoAcumulado)}
                      </td>
                      {formatNumber(venta.porcentajeAcumulado)}
                    </TableRow>
                  ))}
                </tbody>
              </VentasTable>
            </Fragment>
          ))}
        </VentasTableContainer>
      </section>
    </div>
  );
};

const AcumuladoWithAuth = withAuth(Acumulado);
AcumuladoWithAuth.getLayout = getVentasLayout;
export default AcumuladoWithAuth;
