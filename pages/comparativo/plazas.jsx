import React, { useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";

import { checkboxLabels, comboValues } from "../../utils/data";
import {
  getMonthByNumber,
  getPrevDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import { getTableName, getValueFromObject, spliceDataObject, parseNumberToBoolean, parseParams, spliteArrDate, } from "../../utils/functions";
import { getComparativoPlazas } from "../../services/ComparativoService";
import {  numberWithCommas, stringFormatNumber, numberAbs, isNegative, selectRow} from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import ViewFilter from "../../components/ViewFilter";
import Stats from "../../components/Stats";
import { v4 } from "uuid";
import { isMobile } from "react-device-detect";
import {Formik, Form} from 'formik'
import { Input, Select, BeetWenYears, Checkbox } from "../../components/inputs/reportInputs";
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";

const Plazas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();

  //Estados de los reportes
  const [dataReport, setDataReport] = useState(null);
  const [reportDate, setReportDate] = useState({current: getPrevDate(1), dateRange:spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1)})

  //Estado del reporte por secciones;
  const [dataReportSeccions, setDataReportSeccions] = useState(null);
  const [seccions, setSeccions] = useState(null);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [displayMode, setDisplayMode] = useState((isMobile ? config?.mobileReportView : config?.desktopReportView));

  const parameters = {
    fecha: getPrevDate(1),
    conIva: parseNumberToBoolean(config?.conIva || 0),
    porcentajeVentasCompromiso: parseNumberToBoolean(config?.porcentajeVentasCompromiso || 0),
    conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
    resultadosPesos: parseNumberToBoolean(config?.resultadosPesos || 0),
    tipoCambioTiendas: parseNumberToBoolean(config?.tipoCambioTiendas || 0),
    agnosComparar: spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1),
    cbAgnosComparar: config?.cbAgnosComparar || 1, 
    mostrarTiendas: config?.cbMostrarTiendas || 'activas',
  }


  const handleSubmit = async values => {
    try {
      const params = removeParams(values);
      const respose = await getComparativoPlazas(parseParams(params));
      await sliceForRegion(respose);
      setDataReport(respose);
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message: 'Error al consultar datos',
      });
    }
  }

  const sliceForRegion = async data =>{
    const regions = getValueFromObject(data, 'plaza');
    setSeccions(regions);
    setCurrentRegion(regions[0]);
    setDataReportSeccions(spliceDataObject(data, regions, 'GRUPO'))
  }

  const removeParams = params => {
    if(params.cbAgnosComparar == 1){
      const {cbAgnosComparar, agnosComparar:[a], ...rest} = params;
      setReportDate(prev => ({...prev, dateRange:[a]}));
      return {...rest, agnosComparar:[a]}
    }else{
      const {cbAgnosComparar, ...rest} = params;
      setReportDate(prev => ({...prev, dateRange:params.agnosComparar}));
      return rest;
    }
  }

  return (
    <div className=" flex flex-col h-full">
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
              <Formik initialValues={parameters} onSubmit={handleSubmit}  enableReinitialize>
                <Form>
                  <AutoSubmitToken/>
                  <fieldset className="space-y-2 mb-3">
                    <Input id='fecha' name='fecha' label='Fecha'/>
                    <Select id='mostrarTiendas' name='mostrarTiendas' label='Mostrar tiendas'>
                      {
                        comboValues.CBMOSTRARTIENDAS.map((item, i) => (
                          <option key={i} value={item.value}>{item.text}</option>
                        ))
                      }
                    </Select>
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
                        label:'Segundo año'
                      }}  
                    />
                  </fieldset>
                  <fieldset className="space-y-1">
                      <Checkbox id='conIva' name='conIva' label={checkboxLabels.VENTAS_IVA}/>
                      <Checkbox id='porcentajeVentasCompromiso' name='porcentajeVentasCompromiso' label={checkboxLabels.VENTAS_VS_COMPROMISO}/>
                      <Checkbox id='conVentasEventos' name='conVentasEventos' label={checkboxLabels.INCLUIR_VENTAS_EVENTOS}/>
                      <Checkbox id='tipoCambioTiendas' name='tipoCambioTiendas' label={checkboxLabels.TIPO_CAMBIO_TIENDAS}/>
                      <Checkbox id='resultadosPesos' name='resultadosPesos' label={checkboxLabels.RESULTADO_PESOS}/>
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
        </div>
      </section>

      <section className="p-4 overflow-auto ">
        <div className=" overflow-y-auto">
          {
            (() => {
              switch (displayMode) {
                case 1:
                  return <Table data={dataReport} date={reportDate} />
                case 2:
                  return <Stat data={dataReport} date={reportDate} />
                case 3:
                  return <StatGroup data={dataReportSeccions} date={reportDate} region={currentRegion} />
                case 4:
                  return <TableMobil data={dataReport} date={reportDate} />
                default:
                  return <Table data={dataReport} date={reportDate} />
              }
            })()
          }
        </div>
      </section>
    </div>
  );
};

const Table = props => {
  const {data, date} = props;
  return(
    <div className="space-y-8">
      {
        (data && Object.keys(data).length > 0) && Object.entries(data).map(([key, values]) => (
          <table className="table-report" key={v4()} onClick={selectRow}>
            <caption>{getTableName(key)}</caption>
            <thead>
              <tr>
                <th rowSpan={2} className='text-center'>Plaza</th>
                <th colSpan={5 + (date.dateRange[1] ? 3 : 0)}>{`Acumulado ${getMonthByNumber(date.current.split("-")[1])}`}</th>
                <th colSpan={5 + (date.dateRange[1] ? 3 : 0)}>Acumulado anual</th>
              </tr>
              <tr>
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
                (values && values.length > 0) && values.map(item => (
                  <tr key={v4()}>
                    <td data-type-format="text" className="priority-cell">{item.plaza}</td>
                    <td className="priority-cell">{ numberWithCommas(item['ventasMensualesActual'+ getYearFromDate(date.current)])}</td>
                    <td>{ numberWithCommas(item['ventasMensualesActual'+ date.dateRange[0]])}</td>
                    <td>{ numberWithCommas(item['presupuestoMensual'+ getYearFromDate(date.current)])}</td>
                    <td>{ numberWithCommas(item['diferenciaMensual' + date.dateRange[0]])}</td>
                    <td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[0]])}>{ numberAbs(item['porcentajeMensual' + date.dateRange[0]])}</td>
                    {date.dateRange[1] && <td>{ numberWithCommas(item['ventasMensualesActual'+ date.dateRange[1]])}</td>}
                    {date.dateRange[1] && <td>{ numberWithCommas(item['diferenciaMensual'+ date.dateRange[1]])}</td>}
                    {date.dateRange[1] && <td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[1]])}>{ numberAbs(item['porcentajeMensual' + date.dateRange[1]])}</td>} 

                    <td className="priority-cell">{ numberWithCommas(item['ventasAnualActual'+ getYearFromDate(date.current)])}</td>
                    <td>{ numberWithCommas(item['ventasAnualActual'+ date.dateRange[0]])}</td>
                    <td>{ numberWithCommas(item['presupuestoAnual'+ getYearFromDate(date.current)])}</td>
                    <td>{ numberWithCommas(item['diferenciaAnual' + date.dateRange[0]])}</td>
                    <td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[0]])}>{ numberAbs(item['porcentajeAnual' + date.dateRange[0]])}</td>
                    {date.dateRange[1] && <td>{ numberWithCommas(item['ventasAnualActual'+ date.dateRange[1]])}</td>}
                    {date.dateRange[1] && <td>{ numberWithCommas(item['diferenciaAnual'+ date.dateRange[1]])}</td>}
                    {date.dateRange[1] && <td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[1]])}>{ numberAbs(item['porcentajeMensual' + date.dateRange[1]])}</td>} 
                  </tr>
                ))
              }
            </tbody>
          </table>
        ))
      }
    </div>
  )
}

const TableMobil = props =>{
  const {data, date} = props;
  return(
    <div className="space-y-8">
      {
        (data && Object.keys(data).length > 0) && Object.entries(data).map(([key, values]) =>(
          <React.Fragment key={v4()}>
            {getTableName(key)}
            <table className="table-report-mobile" onClick={selectRow}>
              <caption> Acumulado{" "}{getMonthByNumber(date.current.split("-")[1])}</caption>
              <thead>
                <tr>
                  <th>Plaza</th>
                  <th> {getYearFromDate(date.current)}</th>
                  <th> {date.dateRange[0]}</th>
                  <th>PPTO</th>
                  <th>(-)</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {
                  (values && values.length > 0) && values.map(item => (
                    <tr key={v4()}>
                      <td data-type-format="text" className="priority-cell">{item.plaza}</td>
                      <td className="priority-cell">{ numberWithCommas(item['ventasMensualesActual'+ getYearFromDate(date.current)])}</td>
                      <td>{ numberWithCommas(item['ventasMensualesActual'+ date.dateRange[0]])}</td>
                      <td>{ numberWithCommas(item['presupuestoMensual'+ getYearFromDate(date.current)])}</td>
                      <td>{ numberWithCommas(item['diferenciaMensual' + date.dateRange[0]])}</td>
                      <td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[0]])}>{ numberAbs(item['porcentajeMensual' + date.dateRange[0]])}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

            <table className="table-report-mobile" onClick={selectRow}>
              <caption> Acumulado Anual</caption>
              <thead>
                <tr>
                  <th>Plaza</th>
                  <th> {getYearFromDate(date.current)}</th>
                  <th> {date.dateRange[0]}</th>
                  <th>PPTO</th>
                  <th>(-)</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {
                  (values && values.length > 0) && values.map(item =>(
                    <tr key={v4()}>
                      <td data-type-format="text" className="priority-cell">{item.plaza}</td>
                      <td className="priority-cell">{ numberWithCommas(item['ventasAnualActual'+ getYearFromDate(date.current)])}</td>
                      <td>{ numberWithCommas(item['ventasAnualActual'+ date.dateRange[0]])}</td>
                      <td>{ numberWithCommas(item['presupuestoAnual'+ getYearFromDate(date.current)])}</td>
                      <td>{ numberWithCommas(item['diferenciaAnual' + date.dateRange[0]])}</td>
                      <td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[0]])}>{ numberAbs(item['porcentajeAnual' + date.dateRange[0]])}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>

            { date.dateRange[1] &&   
              <table className="table-report-mobile" onClick={selectRow}>
                <caption>{`Acumulado Mensual ${date.dateRange[1]}`}</caption>
                <thead>
                  <tr>
                    <th>Plaza</th>
                    <th> {getYearFromDate(date.current)}</th>
                    <th> {date.dateRange[1]}</th>
                    <th>PPTO</th>
                    <th>(-)</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (values && values.length > 0) && values.map(item =>(
                      <tr key={v4()}>
                        <td data-type-format="text" className="priority-cell">{item.plaza}</td>
                        <td className="priority-cell">{ numberWithCommas(item['ventasMensualesActual'+ getYearFromDate(date.current)])}</td>
                        <td>{ numberWithCommas(item['ventasMensualesActual'+ date.dateRange[1]])}</td>
                        <td>{ numberWithCommas(item['presupuestoMensual'+ getYearFromDate(date.current)])}</td>
                        <td>{ numberWithCommas(item['diferenciaMensual'+ date.dateRange[1]])}</td>
                        <td data-porcent-format={isNegative(item['porcentajeMensual' + date.dateRange[1]])}>{ numberAbs(item['porcentajeMensual' + date.dateRange[1]])}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            }

            { date.dateRange[1] &&   
              <table className="table-report-mobile" onClick={selectRow}>
              <caption>{`Acumulado Anual ${date.dateRange[1]}`}</caption>
                <thead>
                  <tr>
                    <th>Plaza</th>
                    <th> {getYearFromDate(date.current)}</th>
                    <th> {date.dateRange[1]}</th>
                    <th>PPTO</th>
                    <th>(-)</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    (values && values.length > 0) && values.map(item => (
                      <tr key={v4()}>
                        <td data-type-format="text" className="priority-cell">{item.plaza}</td>
                        <td className="priority-cell">{ numberWithCommas(item['ventasAnualActual'+ getYearFromDate(date.current)])}</td>
                        <td>{ numberWithCommas(item['ventasAnualActual'+ date.dateRange[1]])}</td>
                        <td>{ numberWithCommas(item['presupuestoAnual'+ getYearFromDate(date.current)])}</td>
                        <td>{ numberWithCommas(item['diferenciaAnual'+ date.dateRange[1]])}</td>
                        <td data-porcent-format={isNegative(item['porcentajeAnual' + date.dateRange[1]])}>{ numberAbs(item['porcentajeMensual' + date.dateRange[1]])}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            }
          </React.Fragment>
        ))
      }
    </div>
  )
}

const Stat = props =>{
  const {data, date} = props;
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {
        (data && Object.keys(data).length > 0) && Object.entries(data).map(([key, val]) => {
          if(val && val.length > 0) {
            const Items =  val.map(item => {
              const acumMes = {
                columnTitle: `Acumulado ${getMonthByNumber(date.current.split("-")[1])}`,
                values:[
                  {
                    caption:getYearFromDate(date.current),
                    value:numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])
                  },
                  {
                    caption:date.dateRange[0],
                    value:numberWithCommas(item['ventasMensualesActual' + date.dateRange[0]])
                  },
                  {
                    caption:'PPTO',
                    value:numberWithCommas(item['presupuestoMensual'+ getYearFromDate(date.current)])
                  },
                  {
                    caption:'(-)',
                    value:numberWithCommas(item['diferenciaMensual' + date.dateRange[0]])
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(item['porcentajeMensual' + date.dateRange[0]])
                  }
                ] 
              }

              const acumMesAnt = {
                columnTitle: `Acumulado ${getMonthByNumber(date.current.split("-")[1])} ${date.dateRange[1]}`,
                values:[
                  {
                    caption:getYearFromDate(date.current),
                    value:numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])
                  },
                  {
                    caption:date.dateRange[1],
                    value:numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])
                  },
                  {
                    caption:'PPTO',
                    value:numberWithCommas(item['presupuestoMensual'+ getYearFromDate(date.current)])
                  },
                  {
                    caption:'(-)',
                    value:numberWithCommas(item['diferenciaMensual' + date.dateRange[1]])
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]])
                  }
                ] 
              }

              const acumAnual = {
                columnTitle: 'Acumulado Anual',
                values:[
                  {
                    caption:getYearFromDate(date.current),
                    value:numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])
                  },
                  {
                    caption:date.dateRange[0],
                    value:numberWithCommas(item['ventasAnualActual' + date.dateRange[0]])
                  },
                  {
                    caption:'PPTO',
                    value:numberWithCommas(item['presupuestoAnual'+ getYearFromDate(date.current)])
                  },
                  {
                    caption:'(-)',
                    value:numberWithCommas(item['diferenciaAnual' + date.dateRange[0]], false)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(item['porcentajeAnual' + date.dateRange[0]], false)
                  }
                ] 
              }

              const acumAnualAnt = {
                columnTitle: `Acumulado Anual ${date.dateRange[1]}`,
                values:[
                  {
                    caption:getYearFromDate(date.current),
                    value:numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])
                  },
                  {
                    caption:date.dateRange[1],
                    value:numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])
                  },
                  {
                    caption:'PPTO',
                    value:numberWithCommas(item['presupuestoAnual'+ getYearFromDate(date.current)])
                  },
                  {
                    caption:'(-)',
                    value:numberWithCommas(item['diferenciaAnual' + date.dateRange[1]], false)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]], false)
                  }
                ] 
              }

              const cols = [acumMes, acumAnual];
              if(date.dateRange[1]) cols.push(acumMesAnt, acumAnualAnt)

              return(
                <Stats
                  key={v4()}
                  title={item.plaza}
                  columns={cols}
                  expand={true}
                />
              )
            });
            return Items;
          }
        })
        
      }
    </div>
  )
}

const StatGroup = props =>{
  const {data, date, region} = props;
  return(
    <>
      {
        (() => {
          if (data && data.hasOwnProperty(region)) {
            let acumMes = [], acumAnual = [], acumMesAnt=[], acumAnualAnt=[];
            if (region !== 'GRUPO') {

              acumMes = data[region].map(item => ({
                columnTitle: item.plaza,
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
                    caption: 'PPTO',
                    value: numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])
                  },
                  {
                    caption: '(-)',
                    value: numberWithCommas(item['diferenciaMensual' + date.dateRange[0]])
                  },
                  {
                    caption: '%',
                    value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[0]])
                  }
                ]
              }));

              acumMesAnt = data[region].map(item => ({
                columnTitle: item.plaza,
                values: [
                  {
                    caption: getYearFromDate(date.current),
                    value: numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])
                  },
                  {
                    caption: date.dateRange[1],
                    value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])
                  },
                  {
                    caption: 'PPTO',
                    value: numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])
                  },
                  {
                    caption: '(-)',
                    value: numberWithCommas(item['diferenciaMensual' + date.dateRange[1]])
                  },
                  {
                    caption: '%',
                    value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]])
                  }
                ]
              }));

              acumAnual = data[region].map(item => ({
                columnTitle: item.plaza,
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
                    caption: 'PPTO',
                    value: numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])
                  },
                  {
                    caption: '(-)',
                    value: numberWithCommas(item['diferenciaAnual' + date.dateRange[0]], false)
                  },
                  {
                    caption: '%',
                    value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[0]], false)
                  }
                ]
              }));

              acumAnualAnt = data[region].map(item => ({
                columnTitle: item.plaza,
                values: [
                  {
                    caption: getYearFromDate(date.current),
                    value: numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])
                  },
                  {
                    caption: date.dateRange[1],
                    value: numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])
                  },
                  {
                    caption: 'PPTO',
                    value: numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])
                  },
                  {
                    caption: '(-)',
                    value: numberWithCommas(item['diferenciaAnual' + date.dateRange[1]], false)
                  },
                  {
                    caption: '%',
                    value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]], false)
                  }
                ]
              }));


            }else{
              Object.entries(data).map(([key, val]) => {
                if (val && val.length > 0) {
                  val.map(item => {
                    acumMes.push({
                      columnTitle: item.plaza,
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
                          caption: 'PPTO',
                          value: numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])
                        },
                        {
                          caption: '(-)',
                          value: numberWithCommas(item['diferenciaMensual' + date.dateRange[0]])
                        },
                        {
                          caption: '%',
                          value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[0]])
                        }
                      ]
                    });

                    acumMesAnt.push({
                      columnTitle: item.plaza,
                      values: [
                        {
                          caption: getYearFromDate(date.current),
                          value: numberWithCommas(item['ventasMensualesActual' + getYearFromDate(date.current)])
                        },
                        {
                          caption: date.dateRange[1],
                          value: numberWithCommas(item['ventasMensualesActual' + date.dateRange[1]])
                        },
                        {
                          caption: 'PPTO',
                          value: numberWithCommas(item['presupuestoMensual' + getYearFromDate(date.current)])
                        },
                        {
                          caption: '(-)',
                          value: numberWithCommas(item['diferenciaMensual' + date.dateRange[1]])
                        },
                        {
                          caption: '%',
                          value: stringFormatNumber(item['porcentajeMensual' + date.dateRange[1]])
                        }
                      ]
                    });

                    acumAnual.push({
                      columnTitle: item.plaza,
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
                          caption: 'PPTO',
                          value: numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])
                        },
                        {
                          caption: '(-)',
                          value: numberWithCommas(item['diferenciaAnual' + date.dateRange[0]], false)
                        },
                        {
                          caption: '%',
                          value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[0]], false)
                        }
                      ]
                    });

                    acumAnualAnt.push({
                      columnTitle: item.plaza,
                      values: [
                        {
                          caption: getYearFromDate(date.current),
                          value: numberWithCommas(item['ventasAnualActual' + getYearFromDate(date.current)])
                        },
                        {
                          caption: date.dateRange[1],
                          value: numberWithCommas(item['ventasAnualActual' + date.dateRange[1]])
                        },
                        {
                          caption: 'PPTO',
                          value: numberWithCommas(item['presupuestoAnual' + getYearFromDate(date.current)])
                        },
                        {
                          caption: '(-)',
                          value: numberWithCommas(item['diferenciaAnual' + date.dateRange[1]], false)
                        },
                        {
                          caption: '%',
                          value: stringFormatNumber(item['porcentajeAnual' + date.dateRange[1]], false)
                        }
                      ]
                    });
                  })
                }
              });
            }

            const acumMesCol = [acumMes];
            const acumAnualCol = [acumAnual]


            if(date.dateRange[1] && region !== 'GRUPO'){
              acumMesCol.push(acumMesAnt);
              acumAnualCol.push(acumAnualAnt);
            }
            
            return(
              <React.Fragment key={v4()}>
                <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                  <Stats
                    title= {`Acumulado' ${getMonthByNumber(date.current.split("-")[1])}`}
                    expand={true}
                    columns={acumMesCol.flat(1)}
                  />
                  <Stats
                    title= {'Acumulado Anual'}
                    expand={true}
                    columns={acumAnualCol.flat(1)}
                  />
                  {
                    (date.dateRange[1] && region == 'GRUPO') && 
                    <React.Fragment key={v4()}>
                      <Stats
                        title= {`Acumulado ${getMonthByNumber(date.current.split("-")[1])}  ${date.dateRange[1]}`}
                        expand={true}
                        columns={acumMesCol.flat(1)}
                      />
                      <Stats
                        title= {`Acumulado Anual ${date.dateRange[1]}`}
                        expand={true}
                        columns={acumAnualCol.flat(1)}
                      />
                    </React.Fragment>
                  }
                </div>
              </React.Fragment>
            )
          }
        })()
      }
    </>
  )
}

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
