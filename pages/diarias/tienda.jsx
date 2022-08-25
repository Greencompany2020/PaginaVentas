import { useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { checkboxLabels} from "../../utils/data";
import { getDiariasTienda } from "../../services/DiariasServices";
import {  numberWithCommas, isNegative, numberAbs, selectRow, numberAbsComma } from "../../utils/resultsFormated";
import {
  getInitialTienda,
  getTiendaName,
  parseNumberToBoolean,
  parseParams,
  getLastTwoNumbers
} from "../../utils/functions";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { Form, Formik } from "formik";
import { Select, SelectYear, SelectMonth, Checkbox } from "../../components/inputs/reportInputs";
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";
import { getMonthByNumber } from "../../utils/dateFunctions";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

const Tienda = (props) => {
  const {config} = props;
  const { shops } = useSelector(state => state);
  const sendNotification = useNotification();

  const [reportDate, setReportDate] = useState({
    year: new Date(Date.now()).getUTCFullYear(),
    month: new Date(Date.now()).getMonth() + 1
  });

  const [currentShop, setCurrentShop] = useState(getInitialTienda(shops ));
  const [dataReport, setDataReport] = useState(null);

  const parameters = {
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda: getInitialTienda(shops ),
    conIva: parseNumberToBoolean(config?.conIva || 0),
    semanaSanta: parseNumberToBoolean(config?.semanaSanta || 1),
    resultadosPesos: parseNumberToBoolean(config?.resultadosPesos || 1)
  }

  const handleSubmit = async params => {
    try {
      const response = await getDiariasTienda(parseParams(params));
      setReportDate({year: params.delAgno, month:params.delMes});
      setCurrentShop(getTiendaName(params.tienda));
      setDataReport(response);
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:error.response.data.message || error.message
      })
    }
  }

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title={`Ventas Diarias Tienda ${currentShop}`}/>
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <Formik initialValues={parameters} onSubmit={handleSubmit} enableReinitialize>
              <Form>
                <AutoSubmitToken/>
                <fieldset className="space-y-2 mb-3">
                  <Select id='tienda' name='tienda' label='Tienda'>
                    {
                     shops  && shops .map(tienda =>(
                        <option value={`${tienda.EmpresaWeb}${tienda.NoTienda}`} key={v4()}>{tienda.Descrip}</option>
                      ))
                    }
                  </Select>
                  <div className="grid grid-cols-2 gap-2 ">
                    <SelectMonth id='delMes' name='delMes' label='Del Mes'/>
                    <SelectYear id='delAgno' name='delAgno' label='Del año'/>
                  </div>
                </fieldset>
                <fieldset className="space-y-1">
                    <Checkbox id='conIva' name='conIva' label={checkboxLabels.VENTAS_IVA}/>
                    <Checkbox id='semanaSanta' name='semanaSanta' label={checkboxLabels.SEMANA_SANTA}/>
                    <Checkbox id='resultadosPesos' name='resultadosPesos' label={checkboxLabels.RESULTADO_PESOS}/>
                </fieldset>
              </Form>
            </Formik>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className="p-4 overflow-auto ">
        <div className="overflow-y-auto">
          <table className="table-report-footer" onClick={selectRow}>
            <thead>
              <tr>
                <th colSpan={2} className='text-center'>dia</th>
                <th colSpan={4} className='text-center'>venta por dia</th>
                <th colSpan={5} className='text-center'>{`Acumulado ${ getMonthByNumber(reportDate.month)}`}</th>
                <th colSpan={4} className='text-center'>Acumulado anual</th>
                <th className='text-center'>Dia</th>
              </tr>
              <tr>
                <th>{getLastTwoNumbers(reportDate.year)}</th>
                <th>{getLastTwoNumbers(reportDate.year) - 1}</th>
                <th>{reportDate.year}</th>
                <th>{reportDate.year - 1}</th>
                <th>COMP</th>
                <th>%</th>
                <th>{reportDate.year}</th>
                <th>{reportDate.year - 1}</th>
                <th>COMP</th>
                <th>(-)</th>
                <th>%</th>
                <th>{reportDate.year}</th>
                <th>{reportDate.year - 1}</th>
                <th>COMP</th>
                <th>%</th>
                <th>{getLastTwoNumbers(reportDate.year)}</th>
              </tr>
            </thead>
            <tbody>
              {
                (dataReport && dataReport.length > 0) && dataReport.map(item =>(
                  <tr key={v4()}>
                    <td className="priority-cell">{item.dia}</td>
                    <td>{item.dia}</td>
                    <td className="priority-cell">{numberWithCommas(item.ventaActual)}</td>
                    <td>{numberWithCommas(item.ventaAnterior)}</td>
                    <td>{numberWithCommas(item.compromisoDiario)}</td>
                    <td data-porcent-format={isNegative(item.crecimientoDiario)}>{numberAbs(item.crecimientoDiario)}</td>
                    <td className="priority-cell">{numberWithCommas(item.acumMensualActual)}</td>
                    <td>{numberWithCommas(item.acumMensualAnterior)}</td>
                    <td>{numberWithCommas(item.compromisoAcum)}</td>
                    <td data-porcent-format={isNegative(item.diferencia)}>{numberAbsComma(item.diferencia)}</td>
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
                <td>{getLastTwoNumbers(reportDate.year) - 1}</td>
                <td>{reportDate.year}</td>
                <td>{reportDate.year - 1}</td>
                <td>COMP</td>
                <td>%</td>
                <td>{reportDate.year}</td>
                <td>{reportDate.year - 1}</td>
                <td>COMP</td>
                <td>(-)</td>
                <td>%</td>
                <td>{reportDate.year}</td>
                <td>{reportDate.year - 1}</td>
                <td>COMP</td>
                <td>%</td>
                <td>{getLastTwoNumbers(reportDate.year)}</td>
              </tr>
              <tr>
                <td colSpan={2} className='text-center'>dia</td>
                <td colSpan={4} className='text-center'>venta por dia</td>
                <td colSpan={5} className='text-center'>{`Acumulado ${getMonthByNumber(reportDate.month)}`}</td>
                <td colSpan={4} className='text-center'>Acumulado anual</td>
                <td className='text-center'>Dia</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
