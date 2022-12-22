import { useState, useEffect } from "react";
import { v4 } from "uuid";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import withAuth from "../../components/withAuth";
import {
  InputContainer,
  Checkbox,
  InputDate,
  SelectTiendasGeneral,
} from "../../components/inputs";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { handleChange } from "../../utils/handlers";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import { getOperacionesComparativo } from "../../services/OperacionesService";
import {
  isNegative,
  numberAbs,
  isRegionOrPlaza,
  selectRow,
  numberWithCommas,
} from "../../utils/resultsFormated";
import DateHelper from "../../utils/dateHelper";

const Comparativo = (props) => {
  const { config } = props;
  const dateHelper = DateHelper();
  const sendNotification = useNotification();
  const [params, setParams] = useState({
    fecha: dateHelper.getYesterdayDate(),
    conIva: config?.conIva || 0,
    tiendas: config?.tiendas || 0,
    presupuestoExtraordinario: config?.presupuestoExtraordinario || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    sinAgnoVenta: config?.sinAgnoVenta || 0,
    resultadosPesos: config?.resultadosPesos || 0
  });
  const [data, setData] = useState();


  useEffect(() => {
    (async () => {
      try {
        const response = await getOperacionesComparativo(params);
        setData(response);
      } catch (error) {
        sendNotification({
          type: 'ERROR',
          message: error.response.data.message || error.message
        });
      }
    })()
  }, [params])

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title="Operaciones comparativo"
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputDate
                value={params.fecha}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
              />

              <SelectTiendasGeneral
                value={params.tiendas}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
              />
            </InputContainer>

            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
                checked={params.promedio}
              />

              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PRESUPUESTO_EXTRAORDINARIO}
                name={inputNames.PRESUPUESTO_EXTRAORDINARIO}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
                checked={params.presupuestoExtraordinario}
              />

              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
                checked={params.conVentasEventos}
              />

              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
                checked={params.sinAgnoVenta}
              />

              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
                checked={params.conTiendasCerradas}
              />

              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParams);
                }}
                checked={params.resultadosPesos}
              />

            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className="p-4 overflow-y-auto">
        <div className=" overflow-y-auto">
          <table className="table-report-comparative" onClick={selectRow}>
            <thead>

              <tr className="text-center">
                <th rowSpan={3}>Tienda</th>
                <th colSpan={10}>{dateHelper.getWeekDate(params.fecha)}</th>
                <th colSpan={10}>{`${dateHelper.getweekRange(params.fecha)} ${dateHelper.getCurrentYear(params.fecha)}`}</th>
                <th colSpan={12}>{`Acumulado ${dateHelper.getMonthName(params.fecha)}`}</th>
                <th colSpan={6}>Acumulado Anual </th>
                <th rowSpan={3}>Tienda</th>
              </tr>

              <tr className="text-center">
                <th colSpan={5}>Promedios</th>
                <th colSpan={5}>Operaciones</th>
                <th colSpan={5}>Promedios</th>
                <th colSpan={5}>Operaciones</th>
                <th colSpan={6}>Promedios</th>
                <th colSpan={6}>Operaciones</th>
                <th colSpan={3}>Promedios</th>
                <th colSpan={3}>Operaciones</th>
              </tr>

              <tr>

                {/* Promedios del dia*/}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones del dia */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Promedios semanal */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones semanal */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Promedios mensual */}
                <th>2022</th>
                <th>Comp</th>
                <th>%</th>
                <th>(-)</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones mensual */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>(-)</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Promedios anual */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones anual */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

              </tr>
            </thead>

            <tbody>
              {
                (data && data.length > 0) && data.map(row => (
                  <tr data-row-format={isRegionOrPlaza(row.tienda)} key={v4()}>
                    <td className="text-left table-report-comparative--sticky">{row.tienda}</td>
                    <td>{numberWithCommas(row.promedioDiaActual)}</td>
                    <td>{numberWithCommas(row.promedioCompromisoDia)}</td>
                    <td data-porcent-format={isNegative(row.promedioPorcentajeDiaActual)}>{numberAbs(row.promedioPorcentajeDiaActual)}</td>
                    <td>{numberWithCommas(row.promedioDiaAnterior)}</td>
                    <td data-porcent-format={isNegative(row.promedioPorcentajeDiaAnterior)}>{numberAbs(row.promedioPorcentajeDiaAnterior)}</td>
                    <td>{numberWithCommas(row.operacionesDiaActual)}</td>
                    <td>{numberWithCommas(row.operacionesCompromisoDia)}</td>
                    <td data-porcent-format={isNegative(row.operacionesPorcentajeDiaActual)}>{numberAbs(row.operacionesPorcentajeDiaActual)}</td>
                    <td>{numberWithCommas(row.operacionesDiaAnterior)}</td>
                    <td data-porcent-format={isNegative(row.operacionesPorcentajeDiaAnterior)}>{numberAbs(row.operacionesPorcentajeDiaAnterior)}</td>

                    <td>{numberWithCommas(row.promedioSemanaActual)}</td>
                    <td>{numberWithCommas(row.promedioCompromisoSemana)}</td>
                    <td data-porcent-format={isNegative(row.promedioPorcentajeSemanaActual)}>{numberAbs(row.promedioPorcentajeSemanaActual)}</td>
                    <td>{numberWithCommas(row.promedioSemanaAnterior)}</td>
                    <td data-porcent-format={isNegative(row.promedioPorcentajeSemanaAnterior)}>{numberAbs(row.promedioPorcentajeSemanaAnterior)}</td>
                    <td>{numberWithCommas(row.operacionesSemanaActual)}</td>
                    <td>{numberWithCommas(row.operacionesCompromisoSemana)}</td>
                    <td data-porcent-format={isNegative(row.operacionesPorcentajeSemanalActual)}>{numberAbs(row.operacionesPorcentajeSemanalActual)}</td>
                    <td>{numberWithCommas(row.operacionesSemanaAnterior)}</td>
                    <td data-porcent-format={isNegative(row.operacionesPorcentajeSemanalAnterior)}>{numberAbs(row.operacionesPorcentajeSemanalAnterior)}</td>

                    <td>{numberWithCommas(row.promedioMesActual)}</td>
                    <td>{numberWithCommas(row.promedioCompromisoMes)}</td>
                    <td data-porcent-format={isNegative(row.promedioPorcentajeMesActual)}>{numberAbs(row.promedioPorcentajeMesActual)}</td>
                    <td data-porcent-format={isNegative(row.promedioDiferencia)}>{numberAbs(row.promedioDiferencia)}</td>
                    <td>{numberWithCommas(row.promedioMesAnterior)}</td>
                    <td data-porcent-format={isNegative(row.promedioPorcentajeMesAnterior)}>{numberAbs(row.promedioPorcentajeMesAnterior)}</td>
                    <td>{numberWithCommas(row.operacionesMesActual)}</td>
                    <td>{numberWithCommas(row.operacionesCompromisoMes)}</td>
                    <td data-porcent-format={isNegative(row.operacionesPorcentajeMesActual)}>{numberAbs(row.operacionesPorcentajeMesActual)}</td>
                    <td data-porcent-format={isNegative(row.operacionesDiferencia)}>{numberAbs(row.operacionesDiferencia)}</td>
                    <td>{numberWithCommas(row.operacionesMesAnterior)}</td>
                    <td data-porcent-format={isNegative(row.operacionesPorcentajeMesAnterior)}>{numberAbs(row.operacionesPorcentajeMesAnterior)}</td>

                    <td>{numberWithCommas(row.promedioAnualActual)}</td>
                    <td>{numberWithCommas(row.promedioAnualAnterior)}</td>
                    <td data-porcent-format={isNegative(row.promedioPorcentajeAnual)}>{numberAbs(row.promedioPorcentajeAnual)}</td>
                    <td>{numberWithCommas(row.operacionesAnualActual)}</td>
                    <td>{numberWithCommas(row.operacionesAnualAnterior)}</td>
                    <td data-porcent-format={isNegative(row.operacionesPorcentajeAnual)}>{numberAbs(row.operacionesPorcentajeAnual)}</td>
                    <td>{row.tienda}</td>
                  </tr>
                ))
              }
            </tbody>

            <tfoot>
              <tr className="text-center">
                <th rowSpan={3}>Tienda</th>
                <th colSpan={10}>{dateHelper.getWeekDate(params.fecha)}</th>
                <th colSpan={10}>{`${dateHelper.getweekRange(params.fecha)} ${dateHelper.getCurrentYear(params.fecha)}`}</th>
                <th colSpan={12}>{`Acumulado ${dateHelper.getMonthName(params.fecha)}`}</th>
                <th colSpan={6}>Acumulado Anual </th>
                <th rowSpan={3}>Tienda</th>
              </tr>

              <tr className="text-center">
                <th colSpan={5}>Promedios</th>
                <th colSpan={5}>Operaciones</th>
                <th colSpan={5}>Promedios</th>
                <th colSpan={5}>Operaciones</th>
                <th colSpan={6}>Promedios</th>
                <th colSpan={6}>Operaciones</th>
                <th colSpan={3}>Promedios</th>
                <th colSpan={3}>Operaciones</th>
              </tr>

              <tr>

                {/* Promedios del dia*/}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones del dia */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Promedios semanal */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones semanal */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Promedios mensual */}
                <th>2022</th>
                <th>Comp</th>
                <th>%</th>
                <th>(-)</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones mensual */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>Comp</th>
                <th>%</th>
                <th>(-)</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Promedios anual */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

                {/* Operaciones anual */}
                <th>{dateHelper.getCurrentYear(params.fecha)}</th>
                <th>{dateHelper.getCurrentYear(params.fecha) - 1}</th>
                <th>%</th>

              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};

const ComparativoWithAuth = withAuth(Comparativo);
ComparativoWithAuth.getLayout = getVentasLayout;
export default ComparativoWithAuth;
