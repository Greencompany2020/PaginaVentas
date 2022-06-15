import { useState, useEffect, Fragment } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
  SmallContainer,
} from "../../components/containers";
import { InputContainer, Checkbox, InputDate } from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import { handleChange } from "../../utils/handlers";
import { getComparativoGrupo } from "../../services/ComparativoService";
import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";
import {
  getBeginCurrentWeekDateRange,
  getMonthByNumber,
  getNameDay,
  getPrevDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  getDayWeekName,
  validateDate,
  getTableName,
  rowColor,
  isError,
} from "../../utils/functions";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

function Grupo() {
  const alert = useAlert();
  const [comparativoGrupo, setComparativoGrupo] = useState({});
  const [acumuladoSemanal, setAcumuladoSemanal] = useState(false);
  const [parametrosGrupo, setParametrosGrupo] = useState({
    fecha: getPrevDate(1),
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    noHorasVentasParciales: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 1,
    tipoCambioTiendas: 0,
  });
  const { dateRangeText } = getBeginCurrentWeekDateRange(parametrosGrupo.fecha);

  useEffect(() => {
    if (validateDate(parametrosGrupo.fecha)) {
      getComparativoGrupo(parametrosGrupo).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setComparativoGrupo(response);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosGrupo]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`COMPARATIVO VENTAS DEL AÑO 
          ${parametrosGrupo.fecha.split("-")[0]} (AL ${
          parametrosGrupo.fecha.split("-")[2]
        } DE ${getMonthByNumber(
          parametrosGrupo.fecha.split("-")[1]
        ).toUpperCase()})`}
      />

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputDate
                value={parametrosGrupo.fecha}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_VS_COMPROMISO}
                name={inputNames.PORCENTAJE_COMPROMISO}
                checked={
                  parametrosGrupo.porcentajeVentasCompromiso ? true : false
                }
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.NO_HORAS_VENTAS_PARCIALES}
                name={inputNames.NO_HORAS_VENTAS_PARCIALES}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.ACUMULADO_SEMANAL}
                onChange={() => setAcumuladoSemanal((prev) => !prev)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                checked={parametrosGrupo.sinTiendasSuspendidas ? true : false}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                checked={parametrosGrupo.resultadosPesos ? true : false}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.TIPO_CAMBIO_TIENDAS}
                name={inputNames.TIPO_CAMBIO_TIENDAS}
                onChange={(e) => handleChange(e, setParametrosGrupo)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer>
          {Object?.entries(comparativoGrupo ?? {})?.map(([key, value]) => (
            <Fragment key={key}>
              {getTableName(key)}
              <VentasTable className="last-row-bg">
                <TableHead>
                  <tr>
                    <th rowSpan={2} className="bg-black-shape rounded-tl-xl">
                      Tienda
                    </th>
                    <th colSpan={4} className="bg-black-shape">
                      {getNameDay(parametrosGrupo.fecha)}{" "}
                      {getDayWeekName(parametrosGrupo.fecha)}
                    </th>
                    {acumuladoSemanal && (
                      <th colSpan={4}>Semana Del {dateRangeText}</th>
                    )}
                    <th colSpan={5} className="bg-black-shape">
                      Acumulado{" "}
                      {getMonthByNumber(parametrosGrupo.fecha.split("-")[1])}
                    </th>
                    <th colSpan={5} className="bg-black-shape">
                      Acumlado Anual
                    </th>
                    <th rowSpan={2} className="bg-black-shape rounded-tr-xl">
                      Tienda
                    </th>
                  </tr>
                  <tr className="text-right">
                    <th className="bg-black-shape">
                      {getYearFromDate(parametrosGrupo.fecha)}
                    </th>
                    <th className="bg-black-shape">
                      {Number(getYearFromDate(parametrosGrupo.fecha)) - 1}
                    </th>
                    <th className="bg-black-shape">PPTO.</th>
                    <th className="bg-black-shape">%</th>
                    {acumuladoSemanal && (
                      <>
                        <th className="bg-black-shape">
                          {getYearFromDate(parametrosGrupo.fecha)}
                        </th>
                        <th className="bg-black-shape">
                          {Number(getYearFromDate(parametrosGrupo.fecha)) - 1}
                        </th>
                        <th className="bg-black-shape">PPTO.</th>
                        <th className="bg-black-shape">%</th>
                      </>
                    )}
                    <th className="bg-black-shape">
                      {getYearFromDate(parametrosGrupo.fecha)}
                    </th>
                    <th className="bg-black-shape">
                      {Number(getYearFromDate(parametrosGrupo.fecha)) - 1}
                    </th>
                    <th className="bg-black-shape">PPTO.</th>
                    <th className="bg-black-shape">(-)</th>
                    <th className="bg-black-shape">%</th>
                    <th className="bg-black-shape">
                      {getYearFromDate(parametrosGrupo.fecha)}
                    </th>
                    <th className="bg-black-shape">
                      {Number(getYearFromDate(parametrosGrupo.fecha)) - 1}
                    </th>
                    <th className="bg-black-shape">PPTO.</th>
                    <th className="bg-black-shape">(-)</th>
                    <th className="bg-black-shape">%</th>
                  </tr>
                </TableHead>
                <tbody className="text-xs text-right bg-white text-black">
                  {
                    (()=>{
                      if(value){
                        const count = value.length - 1;
                        const Items = value?.map((tienda, index) => (
                          <TableRow
                            key={tienda.tienda}
                            rowId={tienda.tienda}
                            className={rowColor(tienda)}
                          >
                            <td className="text-left">{tienda.tienda}</td>
                            <td className="font-bold">
                              {numberWithCommas(tienda.ventasActuales)}
                            </td>
                            <td>{numberWithCommas(tienda.ventasAnterior)}</td>
                            <td>{numberWithCommas(tienda.presupuesto)}</td>
                            {formatNumber(tienda.porcentaje, count == index)}
                            {acumuladoSemanal && (
                              <>
                                <td>
                                  {numberWithCommas(tienda.ventasSemanalesActual)}
                                </td>
                                <td c>
                                  {numberWithCommas(tienda.ventasSemanalesAnterior)}
                                </td>
                                <td>{numberWithCommas(tienda.presupuestoSemanal)}</td>
                                {formatNumber(tienda.porcentajeSemanal, count == index)}
                              </>
                            )}
                            <td className="font-bold">
                              {numberWithCommas(tienda.ventasMensualesActual)}
                            </td>
                            <td>
                              {numberWithCommas(tienda.ventasMensualesAnterior)}
                            </td>
                            <td>{numberWithCommas(tienda.presupuestoMensual)}</td>
                            {formatNumber(tienda.diferenciaMensual, count == index)}
                            {formatNumber(tienda.porcentajeMensual, count == index)}
                            <td className="font-bold">
                              {numberWithCommas(tienda.ventasAnualActual)}
                            </td>
                            <td>{numberWithCommas(tienda.ventasAnualAnterior)}</td>
                            <td>{numberWithCommas(tienda.presupuestoAnual)}</td>
                            {formatNumber(tienda.diferenciaAnual, count == index)}
                            {formatNumber(tienda.porcentajeAnual, count == index)}
                            <td className="text-left pl-3">{tienda.tienda}</td>
                          </TableRow>
                        ));
                      return Items;
                      }
                    })()
                  }
                </tbody>
              </VentasTable>
            </Fragment>
          ))}
        </VentasTableContainer>
      </section>
    </div>
  );
}

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
