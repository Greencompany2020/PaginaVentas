import React,{  useState } from "react";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import { getSemanalesPlazas } from "../../services/SemanalesService";
import { comboValues } from "../../utils/data";
import {
  getCurrentWeekDateRange,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  dateRangeTitle,
} from "../../utils/functions";
import {  numberWithCommas, stringFormatNumber, numberAbs, isNegative, selectRow} from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import Stats from "../../components/Stats";
import ViewFilter from "../../components/ViewFilter";
import { isMobile } from "react-device-detect";
import {spliceData, parseParams, parseNumberToBoolean, spliteArrDate, isSecondDateBlock} from '../../utils/functions';
import { v4 } from "uuid";

import { Formik, Form } from "formik";
import { Select, Checkbox, DateRange, BeetWenYears } from "../../components/inputs/reportInputs";
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";
import ExcelButton from '../../components/buttons/ExcelButton'
import exportExcel from '../../utils/excel/exportExcel';
import semPlaza from "../../utils/excel/templates/semPlaza";

const Plazas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  
  //Estados de los reportes
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [dataReport, setDataReport] = useState(null);
  const [reportDate, setReportDate] = useState({beginDate, endDate, dateRange:spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1)});
  const [isDisable, setIsDisable] = useState(isSecondDateBlock(config?.cbAgnosComparar || 1));

  //Estado del reporte por secciones;
  const [dataReportSeccions, setDataReportSeccions] = useState(null);
  const [seccions, setSeccions] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [displayMode, setDisplayMode] = useState((isMobile ? config?.mobileReportView : config?.desktopReportView));

  const params = {
    fechaInicio: beginDate,
    fechaFin: endDate,
    conIva: parseNumberToBoolean(config?.conIva || 0),
    resultadosPesos: parseNumberToBoolean(config?.conIva || 1),
    conVentasEventos:parseNumberToBoolean(config?.conVentasEventos || 0),
    incremento: config?.cbIncremento || 'compromiso',
    mostrarTienda: config?.cbMostrarTiendas || 'activas',
    agnosComparar: spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1),
    tipoCambioTiendas: 0,
    cbAgnosComparar: config?.cbAgnosComparar || 1, 
  }
  Object.seal(params);

  const handleSubmit = async values =>{
    try {
      const params = removeParams(values);
      const response = await getSemanalesPlazas(parseParams(params));
      sliceForRegion(response, response.map(item => item.plaza))
      setDataReport(response);
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message: error.response.data.message || error.message
      });
    }
  }

  const sliceForRegion = async(data,tiendas) =>{
    setSeccions(tiendas);
    setCurrentRegion(tiendas[0] || null);
    setDataReportSeccions(spliceData(data, tiendas));
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

  const handleExport = () =>{
    const template  = semPlaza(
        dateRangeTitle(reportDate.beginDate, reportDate.endDate),
        dataReport, 
        [getYearFromDate(reportDate.endDate), reportDate.dateRange].flat(1)
      );
    exportExcel(`semanales plaza ${reportDate.endDate}`, template.getColums(), template.getRows(), template.style, ['Tiendas Frogs', 'Tienda en linea'])
  }

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Detalles de información / Semanales por plaza" />

      <section className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <ParametersContainer>
            <Parameters>
              <Formik initialValues={params} onSubmit={handleSubmit} enableReinitialize>
                <Form>
                  <AutoSubmitToken/>
                  <fieldset className="space-y-2 mb-3">
                    <DateRange
                      begindDate={{
                        id:'fechaInicio',
                        name:'fechaInicio',
                        label:'Fecha inicial',
                        placeholder : reportDate.beginDate,
                      }}
                      endDate={{
                        id:'fechaFin',
                        name:'fechaFin',
                        label:'Fecha final',
                        placeholder: reportDate.endDate,
                      }}  
                    />
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
                    <Select id='mostrarTienda' name='mostrarTienda' label='Mostrar tiendas'>
                      {
                        comboValues.CBMOSTRARTIENDAS.map((item, i) => (
                          <option key={i} value={item.value}>{item.text}</option>
                        ))
                      }
                    </Select>
                  </fieldset>
                  <fieldset className="space-y-1">
                      <Checkbox id='conIva' name='conIva' label='Ventas con Iva' />
                      <Checkbox id='conVentasEventos' name='conVentasEventos' label='Incluir ventas de eventos' />
                      <Checkbox id='resultadosPesos' name='resultadosPesos' label='Resultados en pesos' />
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
          <p className='text-sm font-bold'>Frogs</p>
          <ExcelButton handleClick={handleExport}/>
        </div>
      </section>

      <section className="p-4 overflow-auto ">
        <div className=" overflow-y-auto">
          {
            (()=>{
              switch(displayMode){
                case 1:
                  return <Table data={dataReport} date={reportDate}/>
                case 2:
                  return <Stat data={dataReport} date={reportDate}/>
                case 3:
                  return <StatGroup data={dataReportSeccions} date={reportDate} region={currentRegion}/>
                case 4:
                  return <TableMobil data={dataReport} date={reportDate}/>
                default:
                  return <Table data={dataReport} date={reportDate}/>
              }
            })()
          }
        </div>
      </section>
    </div>
  );
};

const Table = (props) => {
  const {data, date} = props;

  return(
    <table className="table-report" onClick={selectRow}>
      <thead>
        <tr>
          <th rowSpan={3} className='text-center'>Plaza</th>
          <th colSpan={12 + (date.dateRange.length == 2 ? 6 : 0)} className='text-center'>{dateRangeTitle(date.beginDate, date.endDate)}</th>
        </tr>
        <tr>
          <th rowSpan={2}>Comp</th>
          <th rowSpan={2}>{getYearFromDate(date.endDate)}</th>
          {
            date.dateRange.map(year => (
              <React.Fragment key={v4()}>
                <th rowSpan={2}>%</th>
                <th rowSpan={2}>{year}</th>
              </React.Fragment>
            ))
          }
          <th colSpan={3 + (date.dateRange.length == 2 ? 3 : 1)}>operaciones</th>
          <th colSpan={3 + (date.dateRange.length == 2 ? 3 : 1)}>promedios</th>
        </tr>
        <tr>
        <th>Comp</th>
          <th>{getYearFromDate(date.endDate)}</th>
          {
            date.dateRange.map(year => (
              <React.Fragment key={v4()}>
                <th>%</th>
                <th>{year}</th>
              </React.Fragment>
            ))
          }
          <th>comp</th>
          <th>{getYearFromDate(date.endDate)}</th>
          {
            date.dateRange.map(year => (
              <React.Fragment key={v4()}>
                <th>%</th>
                <th>{year}</th>
              </React.Fragment>
            ))
          }
        </tr>
      </thead>
      <tbody>
        {
          data && data.map(item => (
            <tr key={v4()}>
              <td data-type-format="text" className="priority-cell">{item.plaza}</td>
              <td>{numberWithCommas(item['compromiso' + getYearFromDate(date.endDate)])}</td>
              <td className="priority-cell">{numberWithCommas(item['ventasActuales' + getYearFromDate(date.endDate)])}</td>
              {
                date.dateRange.map(year =>(
                  <React.Fragment key={v4()}>
                    <td data-porcent-format={isNegative(item['porcentaje' + year])}>{numberAbs(item['porcentaje' + year])}</td>
                    <td>{numberWithCommas(item['ventasActuales' + year])}</td>
                  </React.Fragment>
                ))
              }
              <td className="priority-cell">{numberWithCommas(item['operacionesComp' + getYearFromDate(date.endDate)])}</td>
              <td className="priority-cell">{numberWithCommas(item['operacionesActual' + getYearFromDate(date.endDate)])}</td>
              {
                date.dateRange.map(year =>(
                  <React.Fragment key={v4()}>
                    <td data-porcent-format={isNegative(item['porcentajeOperaciones' + year])}>{numberAbs(item['porcentajeOperaciones' + year])}</td>
                    <td>{numberWithCommas(item['operacionesActual' + year])}</td>
                  </React.Fragment>
                ))
              }
              <td className="priority-cell">{numberWithCommas(item['promedioComp' + getYearFromDate(date.endDate)])}</td>
              <td className="priority-cell">{numberWithCommas(item['promedioActual' + getYearFromDate(date.endDate)])}</td>
              {
                date.dateRange.map(year =>(
                  <React.Fragment key={v4()}>
                    <td data-porcent-format={isNegative(item['porcentajePromedios' + year])}>{numberAbs(item['porcentajePromedios' + year])}</td>
                    <td>{numberWithCommas(item['promedioActual' + year])}</td>
                  </React.Fragment>
                ))
              }
            </tr>
          ))
        }
      </tbody>
    </table>  
  )
}

const Stat = (props) => {
  const { data, date } = props;
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {
        data && data.map( item => {
          const comp = {
            columnTitle: 'COMPROMISO',
            values: [
              {
                caption: 'COMP',
                value: numberWithCommas(item['compromiso' + getYearFromDate(date.endDate)])
              },
              {
                caption: getYearFromDate(date.endDate),
                value: numberWithCommas(item['ventasActuales' + getYearFromDate(date.endDate)])
              },
              date.dateRange.map(year => (
                [
                  {
                    caption: '%',
                    value: stringFormatNumber(item['porcentaje' + year])
                  },
                  {
                    caption: year,
                    value: numberWithCommas(item['ventasActuales' + year])
                  }
                ]
              ))
            ].flat(2)
          }

          const operaciones = {
            columnTitle: 'OPERACIONES',
            values: [
              {
                caption: 'COMP',
                value: numberWithCommas(item['operacionesComp' + getYearFromDate(date.endDate)])
              },
              {
                caption: getYearFromDate(date.endDate),
                value: numberWithCommas(item['operacionesActual' + getYearFromDate(date.endDate)])
              },
              date.dateRange.map(year => (
                [
                  {
                    caption: '%',
                    value: stringFormatNumber(item['porcentajeOperaciones' + year])
                  },
                  {
                    caption: year,
                    value: numberWithCommas(item['operacionesActual' + year])
                  }
                ]
              ))
            ].flat(2)
          }

          const promedios = {
            columnTitle: 'PROMEDIOS',
            values: [
              {
                caption: 'COMP',
                value: numberWithCommas(item['promedioComp' + getYearFromDate(date.endDate)])
              },
              {
                caption: getYearFromDate(date.endDate),
                value: numberWithCommas(item['promedioActual' + getYearFromDate(date.endDate)])
              },
              date.dateRange.map(year => (
                [
                  {
                    caption: '%',
                    value: stringFormatNumber(item['porcentajePromedios' + year])
                  },
                  {
                    caption: year,
                    value: numberWithCommas(item['promedioActual' + year])
                  }
                ]
              ))
            ].flat(2)
          }

          return (
            <Stats
              key={v4()}
              title={item.plaza}
              columns={[
                comp,
                operaciones,
                promedios,
              ]}
            />
          )
        })
      }
    </div>
  )
}

const TableMobil = (props) => {
  const {data, date} = props;
 
  return(
    <div className="space-y-8">
      <table className="table-report-mobile" onClick={selectRow}>
        <caption>Compromiso</caption>
        <thead>
          <tr>
            <th>Plaza</th>
            <th>Comp</th>
            <th>{getYearFromDate(date.endDate)}</th>
            {
              date.dateRange.map(year => (
                <React.Fragment key={v4()}>
                  <th>%</th>
                  <th>{year}</th>
                </React.Fragment>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            data && data.map(item =>(
              <tr key={v4()}>
                <td data-type-format="text">{item.plaza}</td>
                <td>{numberWithCommas(item['compromiso' + getYearFromDate(date.endDate)])}</td>
                <td className="priority-cell">{numberWithCommas(item['ventasActuales' + getYearFromDate(date.endDate)])}</td>
                {
                  date.dateRange.map(year =>(
                    <React.Fragment key={v4()}>
                      <td data-porcent-format={isNegative(item['porcentaje' + year])}>{numberAbs(item['porcentaje' + year])}</td>
                      <td>{numberWithCommas(item['ventasActuales' + year])}</td>
                    </React.Fragment>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>

      <table className="table-report-mobile" onClick={selectRow}>
        <caption>Operaciones</caption>
        <thead>
          <tr>
            <th>Plaza</th>
            <th>Comp</th>
            <th>{getYearFromDate(date.endDate)}</th>
            {
              date.dateRange.map(year => (
                <React.Fragment key={v4()}>
                  <th>%</th>
                  <th>{year}</th>
                </React.Fragment>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            data && data.map(item =>(
              <tr key={v4()}>
                <td data-type-format="text">{item.plaza}</td>
                <td className="priority-cell">{numberWithCommas(item['operacionesComp' + getYearFromDate(date.endDate)])}</td>
                <td className="priority-cell">{numberWithCommas(item['operacionesActual' + getYearFromDate(date.endDate)])}</td>
                {
                  date.dateRange.map(year =>(
                    <React.Fragment key={v4()}>
                      <td data-porcent-format={isNegative(item['porcentajeOperaciones' + year])}>{numberAbs(item['porcentajeOperaciones' + year])}</td>
                      <td>{numberWithCommas(item['operacionesActual' + year])}</td>
                    </React.Fragment>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>

      <table className="table-report-mobile" onClick={selectRow}>
        <caption>Promedios</caption>
        <thead>
          <tr>
            <th>Plaza</th>
            <th>Comp</th>
            <th>{getYearFromDate(date.endDate)}</th>
            {
              date.dateRange.map(year => (
                <React.Fragment key={v4()}>
                  <th>%</th>
                  <th>{year}</th>
                </React.Fragment>
              ))
            }
          </tr>
        </thead>
        <tbody>
          {
            data && data.map(item =>(
              <tr key={v4()}>
                <td data-type-format="text">{item.plaza}</td>
                <td className="priority-cell">{numberWithCommas(item['promedioComp' + getYearFromDate(date.endDate)])}</td>
                <td className="priority-cell">{numberWithCommas(item['promedioActual' + getYearFromDate(date.endDate)])}</td>
                {
                  date.dateRange.map(year =>(
                    <React.Fragment key={v4()}>
                      <td data-porcent-format={isNegative(item['porcentajePromedios' + year])}>{numberAbs(item['porcentajePromedios' + year])}</td>
                      <td>{numberWithCommas(item['promedioActual' + year])}</td>
                    </React.Fragment>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>

    </div>
  )
}

const StatGroup = props => {
  const { data, date, region } = props;
  if (data && data.hasOwnProperty(region)) {
    const comp = data[region].map(item => (
      {
        columnTitle: item.plaza,
        values: [
          {
            caption: 'COMP',
            value: numberWithCommas(item['compromiso' + getYearFromDate(date.endDate)])
          },
          {
            caption: getYearFromDate(date.endDate),
            value: numberWithCommas(item['ventasActuales' + getYearFromDate(date.endDate)])
          },
          date.dateRange.map(year => (
            [
              {
                caption: '%',
                value: stringFormatNumber(item['porcentaje' + year])
              },
              {
                caption: year,
                value: numberWithCommas(item['ventasActuales' + year])
              }
            ]
          ))
        ].flat(2)
      }
    ));

    const operaciones = data[region].map(item => (
      {
        columnTitle: item.plaza,
        values: [
          {
            caption: 'COMP',
            value: numberWithCommas(item['operacionesComp' + getYearFromDate(date.endDate)])
          },
          {
            caption: getYearFromDate(date.endDate),
            value: numberWithCommas(item['operacionesActual' + getYearFromDate(date.endDate)])
          },
          date.dateRange.map(year => (
            [
              {
                caption: '%',
                value: stringFormatNumber(item['porcentajeOperaciones' + year])
              },
              {
                caption: year,
                value: numberWithCommas(item['operacionesActual' + year])
              }
            ]
          ))
        ].flat(2)
      }
    ));

    const promedios = data[region].map(item => (
      {
        columnTitle: item.plaza,
        values: [
          {
            caption: 'COMP',
            value: numberWithCommas(item['promedioComp' + getYearFromDate(date.endDate)])
          },
          {
            caption: getYearFromDate(date.endDate),
            value: numberWithCommas(item['promedioActual' + getYearFromDate(date.endDate)])
          },
          date.dateRange.map(year => (
            [
              {
                caption: '%',
                value: stringFormatNumber(item['porcentajePromedios' + year])
              },
              {
                caption: year,
                value: numberWithCommas(item['promedioActual' + year])
              }
            ]
          ))
        ].flat(2)
      }
    ));

    return (
      <>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
          <Stats
            title='COMPROMISO'
            expand={false}
            columns={(comp && [...comp])}
          />
          <Stats
            title='OPERACIONES'
            expand={false}
            columns={(operaciones && [...operaciones])}
          />
          <Stats
            title='PROMEDIOS'
            expand={false}
            columns={(promedios && [...promedios])}
          />
        </div>
      </>
    )
  }

  return null;
}

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
