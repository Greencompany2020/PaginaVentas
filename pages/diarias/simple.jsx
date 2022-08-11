import { useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {ParametersContainer,Parameters,} from "../../components/containers";
import { checkboxLabels} from "../../utils/data";
import { getDiariasTiendaSimple } from "../../services/DiariasServices";
import {getInitialTienda,getLastTwoNumbers,getTiendaName,parseNumberToBoolean,parseParams,} from "../../utils/functions";
import { numberWithCommas, selectRow } from "../../utils/resultsFormated";
import { getMonthByNumber,} from "../../utils/dateFunctions";
import withAuth from "../../components/withAuth";
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import {useNotification} from '../../components/notifications/NotificationsProvider';
import { Form, Formik } from "formik";
import { Select, SelectYear, SelectMonth, Checkbox } from "../../components/inputs/reportInputs";
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";

const Simple = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { tiendas } = useAuth();
  
  const [reportDate, setReportDate] = useState({
    year: new Date(Date.now()).getUTCFullYear(),
    month: new Date(Date.now()).getMonth() + 1
  });

  const [currentShop, setCurrentShop] = useState(getInitialTienda(tiendas));
  const [dataReport, setDataReport] = useState(null);

  const parameters = {
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda: getInitialTienda(tiendas),
    conIva: parseNumberToBoolean(config?.conIva || 0)
  }

  const handleSubmit = async params => {
    try {
      const response = await getDiariasTiendaSimple(parseParams(params));
      setReportDate({year: params.delAgno, month:params.delMes});
      setCurrentShop(getTiendaName(params.tienda));
      setDataReport(response);
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al consultar datos'
      });
    }
  }

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title={`Ventas Diarias ${currentShop} ${getMonthByNumber(reportDate.month)} ${reportDate.year}`}/>
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <Formik initialValues={parameters} onSubmit={handleSubmit}>
                <Form>
                  <AutoSubmitToken/>
                  <fieldset className="space-y-2 mb-3">
                    <Select id='tienda' name='tienda' label='Tienda'>
                      {
                        tiendas && tiendas.map(tienda =>(
                          <option value={`${tienda.EmpresaWeb}${tienda.NoTienda}`} key={tienda.Descrip}>{tienda.Descrip}</option>
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
                  </fieldset>
              </Form>
            </Formik>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className="p-4 overflow-auto">
        <div className="overflow-y-auto">
          <table className="table-report-footer" onClick={selectRow}>
            <thead>
              <tr>
                <th colSpan={2} className='text-center'>dia</th>
                <th colSpan={3} className='text-center'>Venta por dia</th>
              </tr>
              <tr>
                <th>{getLastTwoNumbers(reportDate.year)}</th>
                <th>{getLastTwoNumbers(reportDate.year) - 1}</th>
                <th>{reportDate.year}</th>
                <th>{reportDate.year - 1}</th>
                <th>Acum</th>
              </tr>
            </thead>
            <tbody>
              {
                (dataReport && dataReport.length > 0) && dataReport.map(item => (
                  <tr>
                    <td  className="priority-cell">{item.dia}</td>
                    <td>{item.dia}</td>
                    <td  className="priority-cell">{numberWithCommas(item.ventaActual)}</td>
                    <td>{numberWithCommas(item.ventaAnterior)}</td>
                    <td  className="priority-cell">{numberWithCommas(item.acumulado)}</td>
                  </tr>
                ))
              }
            </tbody>
            <tfoot>
              <tr>
                <td >{getLastTwoNumbers(reportDate.year)}</td>
                <td>{getLastTwoNumbers(reportDate.year) - 1}</td>
                <td>{reportDate.year}</td>
                <td>{reportDate.year - 1}</td>
                <td>Acum</td>
              </tr>
              <tr>
                <td colSpan={2}>dia</td>
                <td colSpan={3}>Venta por dia</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
};

const SimpleWithAuth = withAuth(Simple);
SimpleWithAuth.getLayout = getVentasLayout;
export default SimpleWithAuth;
