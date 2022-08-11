import { useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {Parameters,ParametersContainer,} from "../../components/containers";
import { checkboxLabels} from "../../utils/data";
import { getDiariasGrupo } from "../../services/DiariasServices";
import { numberWithCommas, selectRow, isNegative, numberAbs } from "../../utils/resultsFormated";
import { inputNames } from "../../utils/data/checkboxLabels";
import WithAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { parseNumberToBoolean, parseParams,  } from "../../utils/functions";
import { Select, Checkbox, SelectMonth, SelectYear} from "../../components/inputs/reportInputs";
import { Formik, Form } from "formik";
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";
import { getMonthByNumber } from "../../utils/dateFunctions";
import { getLastTwoNumbers } from "../../utils/functions";
import { v4 } from "uuid";

const Grupo = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  
  const [dataReport, setDataReport] = useState(null);
  const [reportDate, setReportDate] = useState({
    year: new Date(Date.now()).getFullYear(),
    month: new Date(Date.now()).getMonth() + 1
  });

  const parameters = {
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tiendas: 0,
    conIva: parseNumberToBoolean(config?.conIva || 0),
    semanaSanta: parseNumberToBoolean(config?.semanaSanta|| 0),
    conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
    conTiendasCerradas: parseNumberToBoolean(config?.conTiendasCerradas || 0),
    sinAgnoVenta: parseNumberToBoolean(config?.sinAgnoVenta || 0),
    sinTiendasSuspendidas: parseNumberToBoolean(config?.sinTiendasSuspendidas || 0),
    resultadosPesos: parseNumberToBoolean(config?.resultadosPesos || 0),
  }
  Object.seal(parameters);

  const handleSubmit = async params => {
    try {
      const response = await getDiariasGrupo(parseParams(params));
      setReportDate({
        year: params.delAgno,
        month: params.delMes
      });
      setDataReport(response);
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al consultar datos'
      })
    }
  }

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Ventas Diarias Grupo Frogs" />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <Formik initialValues={parameters} onSubmit={handleSubmit}>
              <Form>
                  <AutoSubmitToken/>
                  <fieldset className="space-y-2 mb-3">
                    <Select id='tiendas' name='tiendas' label='Tienda'>
                      <option value={0}>Frogs</option>
                      <option value={2}>Skoro</option>
                      <option value={3}>Web</option>
                    </Select>
                    <div className="grid grid-cols-2 gap-2">
                      <SelectMonth id='delMes' name='delMes' label='Del mes'/>
                      <SelectYear id='delAgno' name='delAgno' label='Del año'/>
                    </div>
                  </fieldset>
                  <fieldset className="space-y-1">
                    <Checkbox
                      label={checkboxLabels.VENTAS_IVA}
                      id={inputNames.CON_IVA}
                      name={inputNames.CON_IVA}
                    />
                    <Checkbox
                      label={checkboxLabels.SEMANA_SANTA}
                      id={inputNames.SEMANA_SANTA}
                      name={inputNames.SEMANA_SANTA}
                    />
                    <Checkbox
                      label={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                      id={inputNames.CON_VENTAS_EVENTOS}
                      name={inputNames.CON_VENTAS_EVENTOS}
                    />
                    <Checkbox
                      label={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                      id={inputNames.CON_TIENDAS_CERRADAS}
                      name={inputNames.CON_TIENDAS_CERRADAS}
                    />
                    <Checkbox
                      label={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                      id={inputNames.SIN_AGNO_VENTA}
                      name={inputNames.SIN_AGNO_VENTA}
                    />
                    <Checkbox
                      label={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                      id={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                      name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                    />
                    <Checkbox
                      label={checkboxLabels.RESULTADO_PESOS}
                      id={inputNames.RESULTADOS_PESOS}
                      name={inputNames.RESULTADOS_PESOS}
                    />
                  </fieldset>
              </Form>
            </Formik>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className="p-4 overflow-auto ">
        <div className=" overflow-y-auto">
          <table className="table-report-footer" onClick={selectRow}>
            <thead className=" text-white text-center text-xs  rounded-md">
            <tr>
              <th colSpan={2}>Dia</th>
              <th colSpan={4}>Venta por Dia</th>
              <th colSpan={5} >Acumulado {getMonthByNumber(reportDate.month)}</th>
              <th colSpan={4} >Acumulado Anual</th>
              <th>Dia</th>
            </tr>
            <tr>
              <th>{getLastTwoNumbers(reportDate.year)}</th>
              <th>{getLastTwoNumbers(reportDate.year -1)}</th>
              <th>{reportDate.year}</th>
              <th>{reportDate.year -1}</th>
              <th>COMP.</th>
              <th>%</th>
              <th>{reportDate.year}</th>
              <th>{reportDate.year -1}</th>
              <th>COMP.</th>
              <th>(-)</th>
              <th>%</th>
              <th>{reportDate.year}</th>
              <th>{reportDate.year -1}</th>
              <th>COMP.</th>
              <th>%</th>
              <th>{getLastTwoNumbers(reportDate.year)}</th>
            </tr>
            </thead>
            <tbody>
              {
                dataReport && dataReport.map(item =>(
                  <tr key={v4()} className='bg-none'>
                    <td className="priority-cell">{item.dia}</td>
                    <td>{item.dia}</td>
                    <td className="priority-cell">{numberWithCommas(item.ventaActual)}</td>
                    <td>{numberWithCommas(item.ventaAnterior)}</td>
                    <td>{numberWithCommas(item.compromisoDiario)}</td>
                    <td data-porcent-format={isNegative(item.crecimientoDiario)}>{numberAbs(item.crecimientoDiario)}</td>
                    <td className="priority-cell">{numberWithCommas(item.acumMensualActual)}</td>
                    <td>{numberWithCommas(item.acumMensualAnterior)}</td>
                    <td>{numberWithCommas(item.compromisoAcum)}</td>
                    <td data-porcent-format={isNegative(item.diferencia)}>{numberWithCommas(numberAbs(item.diferencia))}</td>
                    <td data-porcent-format={isNegative(item.crecimientoMensual)}>{numberAbs(item.crecimientoMensual)}</td>
                    <td className="priority-cell">{numberWithCommas(item.acumAnualActual)}</td>
                    <td>{numberWithCommas(item.acumAnualAnterior)}</td>
                    <td>{numberWithCommas(item.compromisoAnual)}</td>
                    <td data-porcent-format={isNegative(item.crecimientoAnual)}>{numberAbs(item.crecimientoAnual)}</td>
                    <td className="priority-cell">{item.dia}</td>
                  </tr>
                ))
              }
            </tbody>
            <tfoot>
                <tr>
                <td>{getLastTwoNumbers(reportDate.year)}</td>
                <td>{getLastTwoNumbers(reportDate.year -1)}</td>
                <td>{reportDate.year}</td>
                <td>{reportDate.year -1}</td>
                <td>COMP.</td>
                <td>%</td>
                <td>{reportDate.year}</td>
                <td>{reportDate.year -1}</td>
                <td>COMP.</td>
                <td>(-)</td>
                <td>%</td>
                <td>{reportDate.year}</td>
                <td>{reportDate.year -1}</td>
                <td>COMP.</td>
                <td>%</td>
                <td>{getLastTwoNumbers(reportDate.year)}</td>
              </tr>
              <tr>
                <td colSpan={2}>Dia</td>
                <td colSpan={4}>Venta por Dia</td>
                <td colSpan={5}>Acumulado {getMonthByNumber(reportDate.month)}</td>
                <td colSpan={4}>Acumulado Anual</td>
                <td>Dia</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};

const GrupoWithAuth = WithAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
