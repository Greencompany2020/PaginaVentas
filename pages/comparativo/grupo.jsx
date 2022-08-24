import React, { useState} from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { checkboxLabels, comboValues } from "../../utils/data";
import { getComparativoGrupo } from "../../services/ComparativoService";
import { formatNumber, stringFormatNumber,numberWithCommas, numberAbs, isNegative, isRegionOrPlaza, numberAbsComma, selectRow } from "../../utils/resultsFormated";
import {
  getBeginCurrentWeekDateRange,
  getMonthByNumber,
  getNameDay,
  getPrevDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  getDayWeekName,
  getTableName,
  rowColor,
  spliceByRegion,
  parseParams,
  parseNumberToBoolean,
  spliteArrDate,
} from "../../utils/functions";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import {useNotification} from '../../components/notifications/NotificationsProvider';
import Stats from "../../components/Stats";
import { v4 } from "uuid";
import ViewFilter from "../../components/ViewFilter";
import { isMobile } from "react-device-detect";
import { Select, Input,BeetWenYears, Checkbox } from "../../components/inputs/reportInputs";
import {Formik ,Form} from 'formik';
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";
import ExcelButton from '../../components/buttons/ExcelButton';
import exportExcel from '../../utils/excel/exportExcel';
import comGrupo from "../../utils/excel/templates/comGrupo";


function Grupo(props) {
  const {config} = props;
  const sendNotification = useNotification();


  
  //Estados de los reportes
  const [dataReport, setDataReport] = useState(null);
  const [reportDate, setReportDate] = useState({current:getPrevDate(1),  dateRange:spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1)});
  const [includeSem, setIncludeSem] = useState(false);

  //Estado del reporte por secciones;
  const [dataReportSeccions, setDataReportSeccions] = useState(null);
  const [seccions, setSeccions] = useState(["REGION I", "REGION II", "REGION III", "WEB", "TOTAL"]);
  const [currentRegion, setCurrentRegion] = useState(seccions[0]);
  const [displayMode, setDisplayMode] = useState((isMobile ? config?.mobileReportView : config?.desktopReportView));
 


  const parameters = {
    fecha:getPrevDate(1),
    conIva: parseNumberToBoolean(config?.conIva || 0),
    incremento: 'compromiso',
    noHorasVentasParciales:parseNumberToBoolean(config?.noHorasVentasParciales || 1),
    conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
    tipoCambioTiendas: parseNumberToBoolean(config?.tipoCambioTiendas || 0),
    agnosComparar: spliteArrDate(config?.agnosComparativos,config?.agnosComparar || 1),
    cbAgnosComparar: config?.cbAgnosComparar || 1,
    resultadosPesos: parseNumberToBoolean(config?.resultadosPesos || 1),
    mostrarTiendas: 'activas'
  }
  Object.seal(parameters);

  const handleSubmit = async values => {
    try {
      const params = removeParams(values);
      const response = await getComparativoGrupo(parseParams(params));
      setDataReport(response);
      setDataReportSeccions(spliceByRegion(response));
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message: 'Error al consultar datos'
      })
    }
  }

  const removeParams = params => {
    if(params.cbAgnosComparar == 1){
      const {cbAgnosComparar, agnosComparar:[a], acumuladoSemanal,  ...rest} = params;
      setReportDate(({current: params.fecha, dateRange:[a]}));
      setIncludeSem(acumuladoSemanal);
      return {...rest, agnosComparar:[a]}
    }else{
      const {cbAgnosComparar, acumuladoSemanal, ...rest} = params;
      setReportDate(({current: params.fecha, dateRange:params.agnosComparar}));
      setIncludeSem(acumuladoSemanal);
      return rest;
    }
  }

  const handleExport = () => {
    const {dateRangeText} = getBeginCurrentWeekDateRange(reportDate.current)
    const template = comGrupo(
      [
        `${getNameDay(reportDate.current)} ${getDayWeekName(reportDate.current)}`,
        `Semana del ${dateRangeText}`,
        `Acumulado ${getMonthByNumber(reportDate.current.split("-")[1])}`
      ],
      dataReport,
      [getYearFromDate(reportDate.current), reportDate.dateRange].flat(1)
    )
    exportExcel(
      `Comparativo Grupo ${reportDate.current}`,
      template.getColumns(),
      template.getRows(),
      template.style,
      ['Tiendas frogs', 'Tienda en linea']
    )
  }

  return (
    <div className=" flex flex-col h-full ">
      <TitleReport
        title={`COMPARATIVO VENTAS DEL AÑO 
          ${reportDate.current.split("-")[0]} (AL ${
            reportDate.current.split("-")[2]
        } DE ${getMonthByNumber(
          reportDate.current.split("-")[1]
        ).toUpperCase()})`}
      />

      <section className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <ParametersContainer>
            <Parameters>
              <Formik initialValues={parameters} onSubmit={handleSubmit} >
                <Form>
                  <AutoSubmitToken />
                  <fieldset className="space-y-2 mb-3">
                    <Input id='fecha' name='fecha' label='Fecha' />
                    <BeetWenYears
                      enabledDates={{
                        id: 'cbAgnosComparar',
                        name: 'cbAgnosComparar',
                        label: 'Años a comparar'
                      }}
                      begindDate={{
                        id: 'agnosComparar[0]',
                        name: 'agnosComparar[0]',
                        label: 'Primer año'
                      }}
                      endDate={{
                        id: 'agnosComparar[1]',
                        name: 'agnosComparar[1]',
                        label: 'Segundo año'
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
                  <fieldset className="space-y-1">
                    <Checkbox id='conIva' name='conIva' label={checkboxLabels.VENTAS_IVA} />
                    <Checkbox id='noHorasVentasParciales' name='noHorasVentasParciales' label={checkboxLabels.NO_HORAS_VENTAS_PARCIALES} />
                    <Checkbox id='conVentasEventos' name='conVentasEventos' label={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
                    <Checkbox id='acumuladoSemanal' name='acumuladoSemanal' label={checkboxLabels.ACUMULADO_SEMANAL} />
                    <Checkbox id='resultadosPesos' name='resultadosPesos' label={checkboxLabels.RESULTADO_PESOS} />
                    <Checkbox id='tipoCambioTiendas' name='tipoCambioTiendas' label={checkboxLabels.TIPO_CAMBIO_TIENDAS} />
                  </fieldset>
                </Form>
              </Formik>
            </Parameters>
          </ParametersContainer>
          <ViewFilter 
            viewOption={displayMode} 
            handleView={setDisplayMode} 
            selectOption={currentRegion} 
            handleSelect = {setCurrentRegion}
            options={seccions}
          />
        </div>
        <div className="flex justify-between">
          <p className={`text-sm font-bold`}>{currentRegion}</p>
          <ExcelButton handleClick={handleExport}/>
        </div>
      </section>


      <section className="p-4 overflow-y-auto ">
        <div className=" overflow-y-auto">
          {
            (() => {
              switch (displayMode) {
                case 1:
                  return <Table data={dataReport} date={reportDate} includeSem={includeSem} />
                case 2:
                  return <Stat data={dataReport} date={reportDate} includeSem={includeSem} />
                case 3:
                  return <StatGroup data={dataReportSeccions} date={reportDate} region={currentRegion} includeSem={includeSem} />
                case 4:
                  return <TableMovil data={dataReport} date={reportDate} includeSem={includeSem} />
                default:
                  return <Table data={dataReport} date={reportDate} includeSem={includeSem} />
              }
            })()
          }
        </div>
      </section>
    </div>
  );
}


const Table = props => {
  const { date, data, includeSem } = props;
  const {dateRangeText} = getBeginCurrentWeekDateRange(date.current)
  return (
    <div className="space-y-8">
      {
        data && Object.entries(data).map(([key, values]) => (
          <React.Fragment key={v4()}>
           {getTableName(key)}
            <table className="table-report" key={v4()} onClick={selectRow}>
              <thead>
                <tr className="text-center">
                  <th rowSpan={2}>Tienda</th>
                  <th colSpan={date.dateRange[1] ? 6 : 4}>{`${getNameDay(date.current)} ${getDayWeekName(date.current)}`}</th>
                  {includeSem && <th colSpan={date.dateRange[1] ? 6 : 4}>{`Semana del ${dateRangeText}`}</th>}
                  <th colSpan={date.dateRange[1] ? 8 : 5}>{`Acumulado ${getMonthByNumber(date.current.split("-")[1])}`}</th>
                  <th colSpan={date.dateRange[1] ? 8 : 5}>Acumulado Anual</th>
                  <th rowSpan={2}>Tienda</th>
                </tr>
                <tr>
                  <th>{getYearFromDate(date.current)}</th>
                  <th>{date.dateRange[0]}</th>
                  <th>PPTO.</th>
                  <th>%</th>
                  {
                    date.dateRange[1] &&
                    <React.Fragment key={v4()}>
                      <th>{date.dateRange[1]}</th>
                      <th>%</th>
                    </React.Fragment>
                  }

                  {
                    includeSem &&
                    <React.Fragment key={v4()}>
                      <th>{getYearFromDate(date.current)}</th>
                      <th>{date.dateRange[0]}</th>
                      <th>PPTO.</th>
                      <th>%</th>
                      {
                        date.dateRange[1] && 
                        <React.Fragment key={v4()}>
                          <th>{date.dateRange[1]}</th>
                          <th>%</th>
                        </React.Fragment>
                      }
                    </React.Fragment>
                  
                  }

                  <th>{getYearFromDate(date.current)}</th>
                  <th>{date.dateRange[0]}</th>
                  <th>PPTO.</th>
                  <th>(-)</th>
                  <th>%</th>
                  {
                    date.dateRange[1] &&
                    <React.Fragment key={v4()}>
                      <th>{date.dateRange[1]}</th>
                      <th>(-)</th>
                      <th>%</th>
                    </React.Fragment>
                  }

                  <th>{getYearFromDate(date.current)}</th>
                  <th>{date.dateRange[0]}</th>
                  <th>PPTO.</th>
                  <th>(-)</th>
                  <th>%</th>
                  {
                    date.dateRange[1] &&
                    <React.Fragment key={v4()}>
                      <th>{date.dateRange[1]}</th>
                      <th>(-)</th>
                      <th>%</th>
                    </React.Fragment>
                  }
                </tr>
              </thead>
              <tbody>
                {
                  (values && Array.isArray(values)) && values.map(item => (
                    <tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
                      <td className="priority-cell text-left">{item.tienda}</td>
                      <td className="priority-cell">{ numberWithCommas(item['ventasActuales' + getYearFromDate(date.current)])}</td>
                      <td>{ numberWithCommas(item['ventasActuales' + date.dateRange[0]])}</td>
                      <td>{ numberWithCommas(item['presupuesto' + getYearFromDate(date.current)])}</td>
                      <td data-porcent-format={isNegative(item['porcentaje' + getYearFromDate(date.current)])}>{ numberAbs(item['porcentaje' + getYearFromDate(date.current)])}</td>
                      {
                        date.dateRange[1]  && 
                        <React.Fragment key={v4()}>
                          <td className="priority-cell">{ numberWithCommas(item['ventasActuales' + date.dateRange[1]])}</td>
                          <td data-porcent-format={isNegative(item['porcentaje' +date.dateRange[1]])}>{ numberAbs(item['porcentaje' +date.dateRange[1]])}</td>
                        </React.Fragment>
                      }

                      {
                        includeSem &&
                        <React.Fragment key={v4()}>
                          <td className="priority-cell">{ numberWithCommas(item['ventasSemanalesActual' + getYearFromDate(date.current)])}</td>
                          <td>{ numberWithCommas(item['ventasSemanalesActual' + date.dateRange[0]])}</td>
                          <td>{ numberWithCommas(item['presupuestoSemanal' + getYearFromDate(date.current)])}</td>
                          <td data-porcent-format={isNegative(item['porcentajeSemanal' + getYearFromDate(date.current)])}>{ numberAbs(item['porcentajeSemanal' + getYearFromDate(date.current)])}</td>
                          {
                            date.dateRange[1] &&
                            <React.Fragment key={v4()}>
                              <td>{ numberWithCommas(item['ventasSemanalesActual' + date.dateRange[1]])}</td>
                              <td data-porcent-format={isNegative(item['porcentajeSemanal' + date.dateRange[1]])}>{ numberAbs(item['porcentajeSemanal' + date.dateRange[1]])}</td>
                            </React.Fragment>
                          }
                        </React.Fragment>
                      }

                      <td className="priority-cell">{ numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])}</td>
                      <td>{ numberWithCommas(item['ventasMensualesActual' + date.dateRange[0]])}</td>
                      <td>{ numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])}</td>
                      <td 
                        data-porcent-format={isNegative(item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual'])}
                      >
                        { numberAbsComma(item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual'])}
                      </td>
                      <td data-porcent-format={isNegative(item['porcentajeMensual' + getYearFromDate(date.current)])}>{numberAbs(item['porcentajeMensual' + getYearFromDate(date.current)])}</td>
                      {
                        date.dateRange[1] &&
                        <React.Fragment key={v4()}>
                            <td>{ numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['diferenciaMensual' + date.dateRange[1]])}>{ numberAbsComma(item['diferenciaMensual' + date.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[1]])}>{numberAbs(item['porcentajeMensual' + date.dateRange[1]])}</td>
                        </React.Fragment>
                      }

                      <td className="priority-cell">{numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])}</td>
                      <td>{numberWithCommas(item['ventasAnualActual' + date.dateRange[0]])}</td>
                      <td>{numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])}</td>
                      <td 
                        data-porcent-format={isNegative(item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'])}
                      >
                        {numberAbsComma(item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'])}
                      </td>
                      <td data-porcent-format={isNegative(item['porcentajeAnual' + getYearFromDate(date.current)])}>{numberAbs(item['porcentajeAnual' + getYearFromDate(date.current)])}</td>
                      {
                        date.dateRange[1] &&
                        <React.Fragment key={v4()}>
                          <td>{numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])}</td>
                          <td data-porcent-format={isNegative(item['diferenciaAnual' + date.dateRange[1]])}>{numberAbsComma(item['diferenciaAnual' + date.dateRange[1]])}</td>
                          <td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[1]])}>{numberAbs(item['porcentajeAnual' + date.dateRange[1]])}</td>
                        </React.Fragment>
                      }

                      <td className="priority-cell">{item.tienda}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </React.Fragment>
        ))
      }
    </div>
  )

}

const TableMovil = props => {
  const { date, data, includeSem } = props;
  const {dateRangeText} = getBeginCurrentWeekDateRange(date.current)

  return(
    <div className="space-y-4">
      {
        data && Object.entries(data).map(([key, values]) => (
          <React.Fragment key={v4()}>
            {getTableName(key)}
            <div key={v4()} className='space-y-8'>
              <table className="table-report-mobile" onClick={selectRow}>
                <caption>{`${getNameDay(date.current)} ${getDayWeekName(date.current)}`}</caption>
                <thead>
                  <tr>
                    <th>Tienda</th>
                    <th>{getYearFromDate(date.current)}</th>
                    <th>{date.dateRange[0]}</th>
                    <th>PPTO.</th>
                    <th>%</th>
                    {
                      date.dateRange[1] &&
                      <React.Fragment key={v4()}>
                        <th>{date.dateRange[1]}</th>
                        <th>%</th>
                      </React.Fragment>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    (values && Array.isArray(values)) && values.map(item => (
                      <tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
                        <td className="priority-cell text-left">{item.tienda}</td>
                        <td className="priority-cell">{numberWithCommas(item['ventasActuales' + getYearFromDate(date.current)])}</td>
                        <td>{numberWithCommas(item['ventasActuales' + date.dateRange[0]])}</td>
                        <td>{numberWithCommas(item['presupuesto' + getYearFromDate(date.current)])}</td>
                        <td data-porcent-format={isNegative(item['porcentaje' + getYearFromDate(date.current)])}>{numberAbs(item['porcentaje' + getYearFromDate(date.current)])}</td>
                        {
                          date.dateRange[1] &&
                          <React.Fragment key={v4()}>
                            <td className="priority-cell">{numberWithCommas(item['ventasActuales' + date.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentaje' + date.dateRange[1]])}>{numberAbs(item['porcentaje' + date.dateRange[1]])}</td>
                          </React.Fragment>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              {
                includeSem &&
                <table className="table-report-mobile" onClick={selectRow}>
                  <caption>{`Semana del ${dateRangeText}`}</caption>
                  <thead>
                    <tr>
                      <th>Tienda</th>
                      <th>{getYearFromDate(date.current)}</th>
                      <th>{date.dateRange[0]}</th>
                      <th>PPTO.</th>
                      <th>%</th>
                      {
                        date.dateRange[1] &&
                        <React.Fragment key={v4()}>
                          <th>{date.dateRange[1]}</th>
                          <th>%</th>
                        </React.Fragment>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (values && Array.isArray(values)) && values.map(item => (
                        <tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
                          <td className="priority-cell text-left">{item.tienda}</td>
                          <td className="priority-cell">{numberWithCommas(item['ventasSemanalesActual' + getYearFromDate(date.current)])}</td>
                          <td>{numberWithCommas(item['ventasSemanalesActual' + date.dateRange[0]])}</td>
                          <td>{numberWithCommas(item['presupuestoSemanal' + getYearFromDate(date.current)])}</td>
                          <td data-porcent-format={isNegative(item['porcentajeSemanal' + getYearFromDate(date.current)])}>{numberAbs(item['porcentajeSemanal' + getYearFromDate(date.current)])}</td>
                          {
                            date.dateRange[1] &&
                            <React.Fragment key={v4()}>
                              <td>{numberWithCommas(item['ventasSemanalesActual' + date.dateRange[1]])}</td>
                              <td data-porcent-format={isNegative(item['porcentajeSemanal' + date.dateRange[1]])}>{numberAbs(item['porcentajeSemanal' + date.dateRange[1]])}</td>
                            </React.Fragment>
                          }
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              }

              <table className="table-report-mobile" onClick={selectRow}>
                <caption>{`Acumulado ${getMonthByNumber(date.current.split("-")[1])}`}</caption>
                <thead>
                  <tr>
                    <th>Tienda</th>
                    <th>{getYearFromDate(date.current)}</th>
                    <th>{date.dateRange[0]}</th>
                    <th>PPTO.</th>
                    <th>(-)</th>
                    <th>%</th>
                    {
                      date.dateRange[1] &&
                      <React.Fragment key={v4()}>
                        <th>{date.dateRange[1]}</th>
                        <th>(-)</th>
                        <th>%</th>
                      </React.Fragment>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    (values && Array.isArray(values)) && values.map(item => (
                      <tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
                        <td className="priority-cell text-left">{item.tienda}</td>
                        <td className="priority-cell">{numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])}</td>
                        <td>{numberWithCommas(item['ventasMensualesActual' + date.dateRange[0]])}</td>
                        <td>{numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])}</td>
                        <td 
                          data-porcent-format={isNegative(item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual'])}
                        >
                          {numberAbsComma(item['diferenciaMensual' + date.dateRange[0]] || item['diferenciaMensual'])}
                        </td>
                        <td data-porcent-format={isNegative(item['porcentajeMensual' + getYearFromDate(date.current)])}>{numberAbs(item['porcentajeMensual' + getYearFromDate(date.current)])}</td>
                        {
                          date.dateRange[1] &&
                          <React.Fragment key={v4()}>
                            <td>{numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['diferenciaMensual' + date.dateRange[1]])}>{numberAbsComma(item['diferenciaMensual' + date.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[1]])}>{numberAbs(item['porcentajeMensual' + date.dateRange[1]])}</td>
                          </React.Fragment>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <table className="table-report-mobile" onClick={selectRow}>
                <caption>Acumulado Anual</caption>
                <thead>
                  <tr>
                    <th>Tienda</th>
                    <th>{getYearFromDate(date.current)}</th>
                    <th>{date.dateRange[0]}</th>
                    <th>PPTO.</th>
                    <th>(-)</th>
                    <th>%</th>
                    {
                      date.dateRange[1] &&
                      <React.Fragment key={v4()}>
                        <th>{date.dateRange[1]}</th>
                        <th>(-)</th>
                        <th>%</th>
                      </React.Fragment>
                    }
                  </tr>
                </thead>
                <tbody>
                  {
                    (values && Array.isArray(values)) && values.map(item => (
                      <tr key={v4()} data-row-format={isRegionOrPlaza(item.tienda)}>
                        <td className="priority-cell text-left">{item.tienda}</td>
                        <td className="priority-cell">{numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])}</td>
                        <td>{numberWithCommas(item['ventasAnualActual' + date.dateRange[0]])}</td>
                        <td>{numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])}</td>
                        <td 
                          data-porcent-format={isNegative(item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'])}
                        >
                          {numberAbsComma(item['diferenciaAnual' + date.dateRange[0]] || item['diferenciaAnual'])}
                        </td>
                        <td data-porcent-format={isNegative(item['porcentajeAnual' + getYearFromDate(date.current)])}>{numberAbs(item['porcentajeAnual' + getYearFromDate(date.current)])}</td>
                        {
                          date.dateRange[1] &&
                          <React.Fragment key={v4()}>
                            <td>{numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['diferenciaAnual' + date.dateRange[1]])}>{numberAbsComma(item['diferenciaAnual' + date.dateRange[1]])}</td>
                            <td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[1]])}>{numberAbs(item['porcentajeAnual' + date.dateRange[1]])}</td>
                          </React.Fragment>
                        }
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </React.Fragment>
        ))
      }
    </div>
  )
}

const Stat = props => {
  const { date, data, includeSem } = props;
  const {dateRangeText} = getBeginCurrentWeekDateRange(date.current)

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {
        data && Object.entries(data).map(([key, values]) => {
          const Items =  values && values.map(item =>{
            const acumDia = {
              columnTitle: getNameDay(date.current) +' '+ getDayWeekName(date.current),
              values:[
                {
                  caption: getYearFromDate(date.current),
                  value: numberWithCommas(item['ventasActuales' + getYearFromDate(date.current)])
                },
                {
                  caption:date.dateRange[0],
                  value: numberWithCommas(item['ventasActuales' + date.dateRange[0]])
                },
                {
                  caption:'PPTO.',
                  value: numberWithCommas(item['presupuesto' + getYearFromDate(date.current)])
                },
                {
                  caption:'%',
                  value: stringFormatNumber(item['porcentaje' + getYearFromDate(date.current)])
                },
                date.dateRange[1] && [
                  {
                    caption:date.dateRange[1],
                    value: numberWithCommas(item['ventasActuales' + date.dateRange[1]])
                  },
                  {
                    caption:'%',
                    value: stringFormatNumber(item['porcentaje' + date.dateRange[1]])
                  }
                ]
              ].flat(2)
            }

            const acumSem = {
              columnTitle: `Semana del ${dateRangeText}`,
              values:[
                {
                  caption: getYearFromDate(date.current),
                  value: numberWithCommas(item['ventasSemanalesActual' + getYearFromDate(date.current)])
                },
                {
                  caption:date.dateRange[0],
                  value: numberWithCommas(item['ventasSemanalesActual' + date.dateRange[0]])
                },
                {
                  caption:'PPTO.',
                  value: numberWithCommas(item['presupuestoSemanal' + getYearFromDate(date.current)])
                },
                {
                  caption:'%',
                  value: stringFormatNumber(item['porcentajeSemanal' + getYearFromDate(date.current)])
                },
                date.dateRange[1] && [
                  {
                    caption:date.dateRange[1],
                    value: numberWithCommas(item['ventasSemanalesActual' + date.dateRange[1]])
                  },
                  {
                    caption:'%',
                    value: stringFormatNumber(item['porcentajeSemanal' + date.dateRange[1]])
                  }
                ]
              ].flat(2)
            }

            const acumMes = {
              columnTitle: `Acumulado ${getMonthByNumber(date.current.split("-")[1])}`,
              values:[
                {
                  caption: getYearFromDate(date.current),
                  value: numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])
                },
                {
                  caption:date.dateRange[0],
                  value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[0]])
                },
                {
                  caption:'PPTO.',
                  value: numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])
                },
                {
                  caption:'(-)',
                  value: stringFormatNumber(item['diferenciaMensual' + getYearFromDate(date.current)] || item['diferenciaMensual'])
                },
                {
                  caption:'%',
                  value: stringFormatNumber(item['porcentajeMensual' + getYearFromDate(date.current)])
                },
                date.dateRange[1] && [
                  {
                    caption:date.dateRange[1],
                    value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])
                  },
                  {
                    caption:'(-)',
                    value: stringFormatNumber(item['diferenciaMensual' + getYearFromDate(date.current)])
                  },
                  {
                    caption:'%',
                    value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]])
                  }
                ]
              ].flat(2)
            }

            const acumAnua  = {
              columnTitle: 'Acumulado Anual',
              values:[
                {
                  caption: getYearFromDate(date.current),
                  value: numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])
                },
                {
                  caption:date.dateRange[0],
                  value: numberWithCommas(item['ventasAnualActual' + date.dateRange[0]])
                },
                {
                  caption:'PPTO.',
                  value: numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])
                },
                {
                  caption:'(-)',
                  value: stringFormatNumber(item['diferenciaAnual' + getYearFromDate(date.current)] || item['diferenciaAnual'])
                },
                {
                  caption:'%',
                  value: stringFormatNumber(item['porcentajeAnual' + getYearFromDate(date.current)])
                },
                date.dateRange[1] && [
                  {
                    caption:date.dateRange[1],
                    value: numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])
                  },
                  {
                    caption:'(-)',
                    value: stringFormatNumber(item['diferenciaAnual' + getYearFromDate(date.current)])
                  },
                  {
                    caption:'%',
                    value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]])
                  }
                ]
              ].flat(2)
            }

            return(
              <Stats
                key={v4()}
                title={item.tienda}
                expand = {includeSem ? true : false}
                columns={[
                  acumDia,
                  includeSem && acumSem,
                  acumMes,
                  acumAnua
                ]}
              />
            )
          });
          return Items
        })
      }
    </div>
  )
}

const StatGroup = props => {
  const { date, data, includeSem, region } = props;
  const {dateRangeText} = getBeginCurrentWeekDateRange(date.current);

  if(data && data.hasOwnProperty(region)){
    const acumDia = [];
    const acumSem = [];
    const acumMes = [];
    const acumAnual = [];

    if(region !== 'TOTAL'){
      data[region].forEach(item =>{
        acumDia.push(
          {
            columnTitle: item.tienda,
            values: [
              {
                caption: getYearFromDate(date.current),
                value: numberWithCommas(item['ventasActuales' + getYearFromDate(date.current)])
              },
              {
                caption: date.dateRange[0],
                value: numberWithCommas(item['ventasActuales' + date.dateRange[0]])
              },
              {
                caption: 'PPTO.',
                value: numberWithCommas(item['presupuesto' + getYearFromDate(date.current)])
              },
              {
                caption: '%',
                value: stringFormatNumber(item['porcentaje' + getYearFromDate(date.current)])
              },
              date.dateRange[1] && [
                {
                  caption: date.dateRange[1],
                  value: numberWithCommas(item['ventasActuales' + date.dateRange[1]])
                },
                {
                  caption: '%',
                  value: stringFormatNumber(item['porcentaje' + date.dateRange[1]])
                }
              ]
            ].flat(2)
          }
        )

        acumSem.push(
          {
            columnTitle: item.tienda,
            values: [
              {
                caption: getYearFromDate(date.current),
                value: numberWithCommas(item['ventasSemanalesActual' + getYearFromDate(date.current)])
              },
              {
                caption: date.dateRange[0],
                value: numberWithCommas(item['ventasSemanalesActual' + date.dateRange[0]])
              },
              {
                caption: 'PPTO.',
                value: numberWithCommas(item['presupuestoSemanal' + getYearFromDate(date.current)])
              },
              {
                caption: '%',
                value: stringFormatNumber(item['porcentajeSemanal' + getYearFromDate(date.current)])
              },
              date.dateRange[1] && [
                {
                  caption: date.dateRange[1],
                  value: numberWithCommas(item['ventasSemanalesActual' + date.dateRange[1]])
                },
                {
                  caption: '%',
                  value: stringFormatNumber(item['porcentajeSemanal' + date.dateRange[1]])
                }
              ]
            ].flat(2)
          }
        )

        acumMes.push(
          {
            columnTitle: item.tienda,
            values: [
              {
                caption: getYearFromDate(date.current),
                value: numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])
              },
              {
                caption: date.dateRange[0],
                value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[0]])
              },
              {
                caption: 'PPTO.',
                value: numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])
              },
              {
                caption: '(-)',
                value: stringFormatNumber(item['diferenciaMensual' + getYearFromDate(date.current)] || item['diferenciaMensual'])
              },
              {
                caption: '%',
                value: stringFormatNumber(item['porcentajeMensual' + getYearFromDate(date.current)])
              },
              date.dateRange[1] && [
                {
                  caption: date.dateRange[1],
                  value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])
                },
                {
                  caption: '(-)',
                  value: stringFormatNumber(item['diferenciaMensual' + getYearFromDate(date.current)])
                },
                {
                  caption: '%',
                  value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]])
                }
              ]
            ].flat(2)
          }
        )

        acumAnual.push(
          {
            columnTitle: item.tienda,
            values:[
              {
                caption: getYearFromDate(date.current),
                value: numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])
              },
              {
                caption:date.dateRange[0],
                value: numberWithCommas(item['ventasAnualActual' + date.dateRange[0]])
              },
              {
                caption:'PPTO.',
                value: numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])
              },
              {
                caption:'(-)',
                value: stringFormatNumber(item['diferenciaAnual' + getYearFromDate(date.current)] || item['diferenciaAnual'])
              },
              {
                caption:'%',
                value: stringFormatNumber(item['porcentajeAnual' + getYearFromDate(date.current)])
              },
              date.dateRange[1] && [
                {
                  caption:date.dateRange[1],
                  value: numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])
                },
                {
                  caption:'(-)',
                  value: stringFormatNumber(item['diferenciaAnual' + getYearFromDate(date.current)])
                },
                {
                  caption:'%',
                  value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]])
                }
              ]
            ].flat(2)
          }
        )
      });

      return(
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
          <Stats
            title={getNameDay(date.current) +' '+ getDayWeekName(date.current)}
            columns = {acumDia}
            expand={false}
          />
          { includeSem &&
            <Stats
              title={'Acumulado ' + dateRangeText}
              columns = {acumSem}
              expand={false}
            />
          }
          <Stats
            title={'Acumulado' +' '+ getMonthByNumber(date.current.split("-")[1])}
            columns = {acumMes}
            expand={false}
          />
          <Stats
            title={'Acumulado Anual'}
            columns = {acumAnual}
            expand={false}
          />
        </div>
      )
    }
    else{
      return Object.entries(data.TOTAL).map(([key, item]) => {
        acumDia = [{
          columnTitle: item.tienda,
          values: [
            {
              caption: getYearFromDate(date.current),
              value: numberWithCommas(item['ventasActuales' + getYearFromDate(date.current)])
            },
            {
              caption: date.dateRange[0],
              value: numberWithCommas(item['ventasActuales' + date.dateRange[0]])
            },
            {
              caption: 'PPTO.',
              value: numberWithCommas(item['presupuesto' + getYearFromDate(date.current)])
            },
            {
              caption: '%',
              value: stringFormatNumber(item['porcentaje' + getYearFromDate(date.current)])
            },
            date.dateRange[1] && [
              {
                caption: date.dateRange[1],
                value: numberWithCommas(item['ventasActuales' + date.dateRange[1]])
              },
              {
                caption: '%',
                value: stringFormatNumber(item['porcentaje' + date.dateRange[1]])
              }
            ]
          ].flat(2)
        }]

        acumSem = [{
          columnTitle: item.tienda,
          values: [
            {
              caption: getYearFromDate(date.current),
              value: numberWithCommas(item['ventasSemanalesActual' + getYearFromDate(date.current)])
            },
            {
              caption: date.dateRange[0],
              value: numberWithCommas(item['ventasSemanalesActual' + date.dateRange[0]])
            },
            {
              caption: 'PPTO.',
              value: numberWithCommas(item['presupuestoSemanal' + getYearFromDate(date.current)])
            },
            {
              caption: '%',
              value: stringFormatNumber(item['porcentajeSemanal' + getYearFromDate(date.current)])
            },
            date.dateRange[1] && [
              {
                caption: date.dateRange[1],
                value: numberWithCommas(item['ventasSemanalesActual' + date.dateRange[1]])
              },
              {
                caption: '%',
                value: stringFormatNumber(item['porcentajeSemanal' + date.dateRange[1]])
              }
            ]
          ].flat(2)
        }]

        acumMes = [{
          columnTitle: item.tienda,
          values: [
            {
              caption: getYearFromDate(date.current),
              value: numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])
            },
            {
              caption: date.dateRange[0],
              value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[0]])
            },
            {
              caption: 'PPTO.',
              value: numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])
            },
            {
              caption: '(-)',
              value: stringFormatNumber(item['diferenciaMensual' + getYearFromDate(date.current)] || item['diferenciaMensual'])
            },
            {
              caption: '%',
              value: stringFormatNumber(item['porcentajeMensual' + getYearFromDate(date.current)])
            },
            date.dateRange[1] && [
              {
                caption: date.dateRange[1],
                value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])
              },
              {
                caption: '(-)',
                value: stringFormatNumber(item['diferenciaMensual' + getYearFromDate(date.current)])
              },
              {
                caption: '%',
                value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]])
              }
            ]
          ].flat(2)
        }]

        acumAnual = [{
          columnTitle: item.tienda,
          values: [
            {
              caption: getYearFromDate(date.current),
              value: numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])
            },
            {
              caption: date.dateRange[0],
              value: numberWithCommas(item['ventasAnualActual' + date.dateRange[0]])
            },
            {
              caption: 'PPTO.',
              value: numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])
            },
            {
              caption: '(-)',
              value: stringFormatNumber(item['diferenciaAnual' + getYearFromDate(date.current)] || item['diferenciaAnual'])
            },
            {
              caption: '%',
              value: stringFormatNumber(item['porcentajeAnual' + getYearFromDate(date.current)])
            },
            date.dateRange[1] && [
              {
                caption: date.dateRange[1],
                value: numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])
              },
              {
                caption: '(-)',
                value: stringFormatNumber(item['diferenciaAnual' + getYearFromDate(date.current)])
              },
              {
                caption: '%',
                value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]])
              }
            ]
          ].flat(2)
        }]

        return(
          // eslint-disable-next-line react/jsx-key
          <div className="mb-8 space-y-4">
            {getTableName(key)}
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
              <Stats
                title={getNameDay(date.current) +' '+ getDayWeekName(date.current)}
                columns = {acumDia}
                expand={false}
              />
              { includeSem &&
                <Stats
                  title={'Acumulado ' + dateRangeText}
                  columns = {acumSem}
                  expand={false}
                />
              }
              <Stats
                title={'Acumulado' +' '+ getMonthByNumber(date.current.split("-")[1])}
                columns = {acumMes}
                expand={false}
              />
              <Stats
                title={'Acumulado Anual'}
                columns = {acumAnual}
                expand={false}
              />
            </div>
          </div>
        )
      })
    }

  
  }
  return(
    <></>
  )
}



const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
