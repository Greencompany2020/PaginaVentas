import React, { useState} from "react";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import { checkboxLabels, inputNames, comboValues } from "../../utils/data";
import {
  getCurrentDate,
  getYearFromDate,
  semanaSanta,
} from "../../utils/dateFunctions";
import {
  getDayName,
  getTableName,
  dateRangeTitleSemanaSanta,
  parseNumberToBoolean,
  spliteArrDate,
  parseParams,
  isSecondDateBlock,
} from "../../utils/functions";
import { getSemanaSantaAcumulado } from "../../services/semanaSantaService";
import {  numberWithCommas, isRegionOrPlaza, isNegative, selectRow, numberAbs } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { Form, Formik } from "formik";
import { Checkbox, BeetWenYears, Select, Input } from "../../components/inputs/reportInputs";
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";
import { v4 } from "uuid";

const Acumulado = (props) => {
  const {config} = props;
  const sendNotification = useNotification();

  const [dataReport, setDataReport] = useState(null);
  const [reportDate, setReportDate] = useState({current:getCurrentDate(true) , dateRange:spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1)});
  const [endWeek, setEndWeek] = useState( parseNumberToBoolean(config?.incluirFinSemanaAnterior || 0));
  const [isDisable, setIsDisable] = useState(isSecondDateBlock(config?.cbAgnosComparar || 1));

  const parameters = {
    fecha: getCurrentDate(true),
    conIva: parseNumberToBoolean(config?.conIva || 0),
    conVentasEventos: parseNumberToBoolean(config?.conVentasEventos,0),
    incluirFinSemanaAnterior: parseNumberToBoolean(config?.incluirFinSemanaAnterior || 0),
    resultadosPesos:parseNumberToBoolean(config?.resultadosPesos || 0),
    incremento: config?.incremento || 'compromiso',
    mostrarTiendas: config?.mostrarTiendas || 'activas',
    tipoCambioTiendas: parseNumberToBoolean(config?.tipoCambioTiendas || 0),
    agnosComparar: spliteArrDate(config?.agnosComparativos, config?.cbAgnosComparar || 1),
    cbAgnosComparar: config?.cbAgnosComparar || 1, 
  }

  const handleSubmit = async values => {
    try {
      const params = removeParams(values);
      const response = await getSemanaSantaAcumulado(parseParams(params));
      setReportDate(prev => ({...prev, current:values.fecha}))
      setEndWeek(values.incluirFinSemanaAnterior);
      setDataReport(response);
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message: error.response.data.message || error.message
      });
    }
  }

  const removeParams = params => {
    if(params.cbAgnosComparar == 1){
      const {cbAgnosComparar, agnosComparar:[a], ...rest} = params;
      setReportDate(prev => ({...prev, dateRange:[a]}));
      setIsDisable(isSecondDateBlock(cbAgnosComparar));
      return {...rest, agnosComparar:[a]}
    }else{
      const {cbAgnosComparar, ...rest} = params;
      setReportDate(prev => ({...prev, dateRange:params.agnosComparar}));
      setIsDisable(isSecondDateBlock(cbAgnosComparar));
      return rest;
    }
  }

  const weekDate = () => {
    return semanaSanta(getYearFromDate(reportDate.current), false, endWeek)[0]

  }

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title={`Ventas Semana Santa del año ${getYearFromDate(reportDate.current || new Date().getFullYear)}`}/>
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
          <Formik initialValues={parameters} onSubmit={handleSubmit} enableReinitialize>
            <Form>
              <AutoSubmitToken/>
              <fieldset className="space-y-2 mb-3">
                <Input type='date' id='fecha' name='fecha' label='Año' placeholder={reportDate.current}/>
                <BeetWenYears
                  enabledDates={{
                    id:'cbAgnosComparar',
                    name:'cbAgnosComparar',
                    label: 'Años a comparar'
                  }}
                  begindDate={{
                    id:'agnosComparar[0]',
                    name:'agnosComparar[0]',
                    label:'Primer año'
                  }}
                  endDate={{
                    id:'agnosComparar[1]',
                    name:'agnosComparar[1]',
                    label:'Segundo año',
                    disabled: isDisable
                  }}  
                />
                <Select id='incremento' name='incremento' label='Formular % de incremento'>
                  {
                    comboValues.CBINCREMENTO.map((item, i) => (
                      <option key={i} value={item.value}>{item.text}</option>
                    ))
                  }
                </Select>
                <Select id='mostrarTiendas' name='mostrarTiendas' label='Mostrar tiendas'>
                  {
                    comboValues.CBMOSTRARTIENDAS.map((item, i) => (
                      <option key={i} value={item.value}>{item.text}</option>
                    ))
                  }
                </Select>
              </fieldset>
              <fieldset>
                <Checkbox id={inputNames.CON_IVA}  name={inputNames.CON_IVA} label={checkboxLabels.VENTAS_IVA}/>
                <Checkbox id={inputNames.CON_VENTAS_EVENTOS}  name={inputNames.CON_VENTAS_EVENTOS} label={checkboxLabels.INCLUIR_VENTAS_EVENTOS}/>
                <Checkbox id={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}  name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR} label={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}/>
                <Checkbox id={inputNames.RESULTADOS_PESOS}  name={inputNames.RESULTADOS_PESOS} label={checkboxLabels.RESULTADO_PESOS}/>
              </fieldset>
            </Form>
          </Formik>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-auto ">
        <div className="overflow-y-auto space-y-8">
          {
           dataReport &&  Object.entries(dataReport).map(([key, value]) => (
              <table key={v4()} className='table-report' onClick={selectRow}>
                <caption>{getTableName(key)}</caption>
                <thead>
                  <tr>
                    <th rowSpan={3} className='text-center'>Tienda</th>
                    <th colSpan={10 + (reportDate.dateRange[1] ? 6 : 0)} className='text-center'> {getDayName(reportDate.current)}</th>
                    <th colSpan={4 + (reportDate.dateRange[1] ? 2 : 0)} className='text-center'>{dateRangeTitleSemanaSanta(weekDate(),reportDate.current)}</th>
                  </tr>
                  <tr>
                    <th colSpan={4 + (reportDate.dateRange[1] ? 2 : 0)}>Ventas</th>
                    <th colSpan={3 + (reportDate.dateRange[1] ? 2 : 0)}>Promedio</th>
                    <th colSpan={3 + (reportDate.dateRange[1] ? 2 : 0)}>Operaciones</th>
                    <th colSpan={4 + (reportDate.dateRange[1] ? 2 : 0)}>Venta</th>
                  </tr>
                  <tr>
                    <th>{getYearFromDate(reportDate.current)}</th>
                    <th>{reportDate.dateRange[0]}</th>
                    <th>PPTO.</th>
                    <th>%</th>
                    {reportDate.dateRange[1] &&
                       <React.Fragment>
                          <th>{reportDate.dateRange[1]}</th>
                          <th>%</th>
                       </React.Fragment>
                    }
                    <th>{getYearFromDate(reportDate.current)}</th>
                    <th>{reportDate.dateRange[0]}</th>
                    <th>%</th>
                    {reportDate.dateRange[1] &&
                       <React.Fragment>
                          <th>{reportDate.dateRange[1]}</th>
                          <th>%</th>
                       </React.Fragment>
                    }
                    <th>{getYearFromDate(reportDate.current)}</th>
                    <th>{reportDate.dateRange[0]}</th>
                    <th>%</th>
                    {reportDate.dateRange[1] &&
                       <React.Fragment>
                          <th>{reportDate.dateRange[1]}</th>
                          <th>%</th>
                       </React.Fragment>
                    }
                    <th>{getYearFromDate(reportDate.current)}</th>
                    <th>{reportDate.dateRange[0]}</th>
                    <th>PPTO.</th>
                    <th>%</th>
                    {reportDate.dateRange[1] &&
                       <React.Fragment>
                          <th>{reportDate.dateRange[1]}</th>
                          <th>%</th>
                       </React.Fragment>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    (value && value.length > 0) && value.map(item => (
                      <tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
                        <td data-type-format="text" className="priority-cell">{item.tienda}</td>
                        <td>{numberWithCommas(item['ventaActual'+ getYearFromDate(reportDate.current)])}</td>
                        <td>{numberWithCommas(item['ventaActual'+ reportDate.dateRange[0]])}</td>
                        <td>{numberWithCommas(item['presupuesto'+ getYearFromDate(reportDate.current)])}</td>
                        <td data-porcent-format={isNegative(item['porcentaje'+ getYearFromDate(reportDate.current)])}>{numberAbs(item['porcentaje'+ getYearFromDate(reportDate.current)])}</td>
                        {reportDate.dateRange[1] &&
                          <React.Fragment key={v4()}>
                            <td>{numberWithCommas(item['ventaActual'+ reportDate.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentaje'+ reportDate.dateRange[1]])}>{numberAbs(item['porcentaje'+ reportDate.dateRange[1]])}</td>
                          </React.Fragment>
                        }

                        <td>{numberWithCommas(item['promedioActual'+ getYearFromDate(reportDate.current)])}</td>
                        <td>{numberWithCommas(item['promedioActual'+ reportDate.dateRange[0]])}</td>
                        <td data-porcent-format={isNegative(item['porcentajePromedios'+ reportDate.dateRange[0]])}>{numberAbs(item['porcentajePromedios'+ reportDate.dateRange[0]])}</td>
                        {reportDate.dateRange[1] &&
                          <React.Fragment key={v4()}>
                            <td>{numberWithCommas(item['promedioActual'+ reportDate.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentajePromedios'+ reportDate.dateRange[1]])}>{numberAbs(item['porcentajePromedios'+ reportDate.dateRange[1]])}</td>
                          </React.Fragment>
                        }

                        <td>{numberWithCommas(item['operacionesActual'+ getYearFromDate(reportDate.current)])}</td>
                        <td>{numberWithCommas(item['operacionesActual'+ reportDate.dateRange[0]])}</td>
                        <td data-porcent-format={isNegative(item['porcentajeOperaciones'+ reportDate.dateRange[0]])}>{numberAbs(item['porcentajeOperaciones'+ reportDate.dateRange[0]])}</td>
                        {reportDate.dateRange[1] &&
                          <React.Fragment key={v4()}>
                            <td>{numberWithCommas(item['operacionesActual'+ reportDate.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentajeOperaciones'+ reportDate.dateRange[1]])}>{numberAbs(item['porcentajeOperaciones'+ reportDate.dateRange[1]])}</td>
                          </React.Fragment>
                        }

                        <td>{numberWithCommas(item['ventaAcumuladaActual'+ getYearFromDate(reportDate.current)])}</td>
                        <td>{numberWithCommas(item['ventaAcumuladaActual'+ reportDate.dateRange[0]])}</td>
                        <td>{numberWithCommas(item['presupuestoAcumulado'+ getYearFromDate(reportDate.current)])}</td>
                        <td data-porcent-format={isNegative(item['porcentajeAcumulado'+ reportDate.dateRange[0]])}>{numberAbs(item['porcentajeAcumulado'+ reportDate.dateRange[0]])}</td>
                        {reportDate.dateRange[1] &&
                          <React.Fragment key={v4()}>
                            <td>{numberWithCommas(item['ventaAcumuladaActual'+ reportDate.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentajeAcumulado'+ reportDate.dateRange[1]])}>{numberAbs(item['pporcentajeAcumulado'+ reportDate.dateRange[1]])}</td>
                          </React.Fragment>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            ))
          }
        </div>
      </section>
    </div>
  );
};

const AcumuladoWithAuth = withAuth(Acumulado);
AcumuladoWithAuth.getLayout = getVentasLayout;
export default AcumuladoWithAuth;
