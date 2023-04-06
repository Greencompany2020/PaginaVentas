import React, { useState, useRef } from "react";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import { checkboxLabels, inputNames, comboValues } from "../../utils/data";
import {
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  parseNumberToBoolean,
  parseToNumber,
  isSecondDateBlock,
  getInitialPlaza,
  getInitialTienda,
  getTiendaName,
  getPlazaName
} from "../../utils/functions";
import { getSemanaSantaGrafica } from "../../services/semanaSantaService";
import { numberWithCommas, isNegative, numberAbs } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { Form, Formik } from "formik";
import { Checkbox, BeetWenYears, Select, Radio, Input } from "../../components/inputs/reportInputs";
import AutoSubmitToken from "../../hooks/useAutoSubmitToken";
import { v4 } from "uuid";
import LineChart from "../../components/LineChart";
import DateHelper from "../../utils/dateHelper";
import { useSelector } from 'react-redux';
import Loader from "../../components/Loader";
import { isMobile } from "react-device-detect";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

const Grafica = (props) => {

  const { config } = props;
  const { places, shops } = useSelector(state => state);
  const sendNotification = useNotification();
  const dateHelpers = DateHelper();
  const [data, setData] = useState(null);
  const [dataSet, setDataSet] = useState({ labels: [], datasets: [] });
  const [reportDate, setReportDate] = useState({ current: dateHelpers.getCurrent(), dateRange: [dateHelpers.getMinusCurrent(1), dateHelpers.getMinusCurrent(1) - 1] });
  const [isDisable, setIsDisable] = useState(isSecondDateBlock(2));
  const [isLoading, setIsLoading] = useState(false);
  const [reportType, setReportType] = useState('grupo');
  const parametersFilter = useRef(null);


  const onPressSubmit = () => {
    if (parametersFilter.current?.isOpen && parametersFilter.current?.close) {
      if (parametersFilter.current.isOpen) {
        parametersFilter.current.close()
      }
    }
  }

  const handleSubmit = async values => {
    try {
      const params = removeParams(values);
      const { agnosComparar, fecha, } = params;
      const { cbAgnosComparar, agnosComparar: [first, last] } = values
      const colors = ['#006400', '#daa520', '#6495ed'];


      const currentYear = dateHelpers.getYearFromEasterWeek(fecha);
      const years = [currentYear, ...agnosComparar];

      if (params.tipo === 'grupo') {
        setReportType('Grupo')
      } else if (params.tipo === 'tiendas') {
        setReportType(`Tienda ${getTiendaName(params.tienda, shops)}`)
      } else if (params.tipo === 'plazas') {
        setReportType(`Plaza ${getPlazaName(params.empresa, places)}`)
      }



      years.forEach((item) => {
        let coincidents = 0;
        years.forEach(secondItem => {
          if (item === secondItem) {
            coincidents++;
          }
        });
        if (coincidents >= 2) {
          throw Error('Los años a comparar no pueden ser identicos')
        }
      })

      setIsLoading(true);
      const result = await getSemanaSantaGrafica(params);
      setData(result);

      const labelDays = result.lista
        .filter(list => list.dia !== 'Porcentaje' && list.dia !== 'Total')
        .flatMap(item => dateHelpers.getDayFromEasterWeek(item.dia));


      const dataSets = years.map((date, i) => {
        const dataInDate = result.lista
          .filter(item => item.dia !== 'Porcentaje' && item.dia !== 'Total')
          .flatMap(itemFilter => itemFilter.datos.filter(secondFilter => secondFilter.agno === date))
          .flatMap(flatItem => flatItem.valor)
        return {
          label: date,
          data: dataInDate,
          backgroundColor: colors[i],
          lineTension: 0.5,
        }
      });

      setDataSet({ labels: labelDays, datasets: dataSets })

      setReportDate({
        current: fecha,
        dateRange: [first, last]
      })

      setIsDisable(isSecondDateBlock(cbAgnosComparar));

    } catch (error) {
      sendNotification({
        type: 'ERROR',
        message: error.response?.data?.message || error.message
      });
    }

    finally {
      setIsLoading(false)
    }
  }

  const removeParams = params => {
    const {
      agnosComparar: [first, last],
      cbAgnosComparar,
    } = params;

    const rest = {
      fecha: params.fecha,
      tienda: params.tienda,
      empresa: params.empresa,
      conIva: parseToNumber(params.conIva),
      conVentasEventos: parseToNumber(params.conVentasEventos),
      incluirFinSemanaAnterior: parseToNumber(params.incluirFinSemanaAnterior),
      resultadosPesos: parseToNumber(params.resultadosPesos),
      tipoCambioTiendas: parseToNumber(params.tipoCambioTiendas),
      agnosComparar: cbAgnosComparar == 1 ? [Number(first)] : [Number(first), Number(last)],
      tipo: params.tipo,
      mostrarTiendas: params.mostrarTiendas,
      mostrarDetalles: parseToNumber(params.mostrarDetalles)
    }

    return rest;
  }


  const onChangeValue = (e) => {
    const { name, value } = e.target

    if (name === 'fecha') {
      const date = dateHelpers.getYearFromEasterWeek(value);
      const dateRange1 = reportDate.dateRange[0] === date ? date - 1 : reportDate.dateRange[0];
      const dateRange2 = reportDate.dateRange[1] === dateRange1 ? dateRange1 - 1 : reportDate.dateRange[1];
      setReportDate({ current: value, dateRange: [Number(dateRange1), Number(dateRange2)] })
    }


    if (name === 'agnosComparar[0]') {
      const dateRange2 = reportDate.dateRange[1] === Number(value) ? Number(value) - 1 : reportDate.dateRange[1]
      setReportDate(prev => ({ ...prev, dateRange: [Number(value), Number(dateRange2)] }))
    }
  }


  return (
    <>
      <div className=" flex flex-col h-full">
        <TitleReport title={`Ventas Semana Santa del año ${dateHelpers.getYearFromEasterWeek(reportDate.current)} (${reportType})`} />
        <section className="p-4 flex flex-row justify-between items-baseline">
          <ParametersContainer ref={parametersFilter}>
            <Parameters>
              <Formik initialValues={{
                fecha: reportDate.current,
                tienda: getInitialTienda(shops),
                empresa: getInitialPlaza(places),
                conIva: parseNumberToBoolean(config?.conIva || 0),
                conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
                incluirFinSemanaAnterior: parseNumberToBoolean(config?.incluirFinSemanaAnterior || 0),
                resultadosPesos: parseNumberToBoolean(config?.resultadosPesos || 1),
                mostrarTiendas: config?.mostrarTiendas || 'activas',
                tipoCambioTiendas: parseNumberToBoolean(config?.tipoCambioTiendas || 0),
                agnosComparar: reportDate.dateRange,
                cbAgnosComparar: 2,
                mostrarDetalles: false,
                tipo: 'grupo'
              }} onSubmit={handleSubmit} enableReinitialize>
                <Form onChange={onChangeValue}>

                  <AutoSubmitToken alwaysFetch={false} />
                  <Input type={'date'} placeholder={reportDate.current} id='fecha' name='fecha' label='Fecha' />
                  <fieldset className='flex space-x-1 border border-slate-400 p-2 rounded-md mb-3 mt-3'>
                    <legend className='text-sm font-semibold text-slate-700'>Mostrar</legend>
                    <Radio id='grupo' name='tipo' value='grupo' label='Grupo' />
                    <Radio id='tiendas' name='tipo' value='tiendas' label='Tienda' />
                    <Radio id='plazas' name='tipo' value='plazas' label='Plaza' />
                  </fieldset>

                  <fieldset className="space-y-2 mb-3">
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
                        label: 'Segundo año',
                        disabled: isDisable
                      }}
                    />
                    <Select id='mostrarTiendas' name='mostrarTiendas' label='Mostrar tiendas'>
                      {
                        comboValues.CBMOSTRARTIENDAS.map((item, i) => (
                          <option key={i} value={item.value}>{item.text}</option>
                        ))
                      }
                    </Select>

                    <Select id='tienda' name='tienda' label='Tienda'>
                      {
                        shops && shops.map(tienda => (
                          <option value={`${tienda.EmpresaWeb}${tienda.NoTienda}`} key={v4()}>{tienda.Descrip}</option>
                        ))
                      }
                    </Select>

                    <Select id='empresa' name='empresa' label='Plaza'>
                      {
                        places && places.map(plaza => (
                          <option value={plaza.NoEmpresa} key={v4()}>{plaza.DescCta}</option>
                        ))
                      }
                    </Select>
                  </fieldset>
                  <fieldset>
                    <Checkbox id={inputNames.CON_IVA} name={inputNames.CON_IVA} label={checkboxLabels.VENTAS_IVA} />
                    <Checkbox id={inputNames.CON_VENTAS_EVENTOS} name={inputNames.CON_VENTAS_EVENTOS} label={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
                    <Checkbox id={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR} name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR} label={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR} />
                    <Checkbox id={inputNames.RESULTADOS_PESOS} name={inputNames.RESULTADOS_PESOS} label={checkboxLabels.RESULTADO_PESOS} />
                    <Checkbox id={inputNames.TIPO_CAMBIO_TIENDAS} name={inputNames.TIPO_CAMBIO_TIENDAS} label={checkboxLabels.TIPO_CAMBIO_TIENDAS} />
                    <Checkbox id={'mostrarDetalles'} name={'mostrarDetalles'} label={"Mostrar detalle por segmento"} />
                  </fieldset>
                  <div className="mt-4">
                    <input type="submit" value={"Buscar"} className="btn-search" disabled={isLoading} onClick={onPressSubmit} />
                  </div>
                </Form>
              </Formik>
            </Parameters>
          </ParametersContainer>
        </section>

        {
          (data) ?
            <section className="p-4 overflow-auto ">
              <div className="overflow-y-auto space-y-8">
                <div>
                  <table className="table-report-grafica">
                    <thead>
                      <tr>
                        <th className="text-left w-28">DIA REF</th>
                        <th>{getYearFromDate(reportDate.current)}</th>
                        {reportDate.dateRange[0] ? <th>% VS {reportDate.dateRange[0]}</th> : null}
                        {reportDate.dateRange[0] ? <th>{reportDate.dateRange[0]}</th> : null}
                        {!isDisable ? <th>% VS {reportDate.dateRange[1]}</th> : null}
                        {!isDisable ? <th>{reportDate.dateRange[1]}</th> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {
                        (data && data?.lista) ?
                          data.lista
                            .map(item => (
                              <tr key={v4()} className={`${(item.dia === 'Total') ? 'bg-gray-400 text-white md:text-xs font-bold' : ''}`}>
                                <td className="text-left">{dateHelpers.getEasterDayWeek(item.dia)}</td>
                                {item.datos
                                  .map(col => (
                                    <React.Fragment key={v4()}>
                                      {(col.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(col.porcentaje)}>{numberAbs(col.porcentaje)}</td> : null}
                                      <td>{numberWithCommas(col.valor)}</td>
                                    </React.Fragment>
                                  ))}
                              </tr>
                            ))
                          : null
                      }
                    </tbody>
                  </table>
                </div>

                <div className="overflow-y-auto h-[30rem]">
                  <LineChart
                    text="Años"
                    data={dataSet}
                  />
                </div>

                {
                  (data && data?.segmentos && data.segmentos.length > 0) ?
                    <div>

                      <div className="bg-blue-100 py-2 px-1 w-fit h-fit rounded-md mb-2">
                        <div className=" flex items-center w-full h-full">
                          <ExclamationCircleIcon width={24} />
                          <p className="ml-1 text-sm">Pueden existir pequeñas diferencias por cuestion de redondeo</p>
                        </div>

                      </div>

                      <table className="table-report-grafica">
                        <thead>
                          <tr>
                            <th className="text-left hidden md:table-cell">DIA REF</th>
                            <th className="text-left w-28 rounded-tl-md md:rounded-none">SEGMENTO</th>
                            <th>{getYearFromDate(reportDate.current)}</th>
                            {reportDate.dateRange[0] ? <th>% VS {reportDate.dateRange[0]}</th> : null}
                            {reportDate.dateRange[0] ? <th>{reportDate.dateRange[0]}</th> : null}
                            {!isDisable ? <th>% VS {reportDate.dateRange[1]}</th> : null}
                            {!isDisable ? <th>{reportDate.dateRange[1]}</th> : null}
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (data && data?.segmentos) ?
                              data.segmentos
                                .map(item => (
                                  <React.Fragment key={v4()}>
                                    <tr>
                                      <td className="text-left font-bold text-xs hidden md:table-cell" rowSpan={3}>{dateHelpers.getEasterDayWeek(item.dia)}</td>
                                      <td className="text-left">LINEA</td>
                                      {item.detalles.linea.map(col => (
                                        <React.Fragment key={v4()}>
                                          {(col.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(col.porcentaje)}>{numberAbs(col.porcentaje)}</td> : null}
                                          <td>{numberWithCommas(col.valor)}</td>
                                        </React.Fragment>
                                      ))}
                                    </tr>

                                    <tr>
                                      <td className="text-left">MODA</td>
                                      {item.detalles.moda.map(col => (
                                        <React.Fragment key={v4()}>
                                          {(col.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(col.porcentaje)}>{numberAbs(col.porcentaje)}</td> : null}
                                          <td>{numberWithCommas(col.valor)}</td>
                                        </React.Fragment>
                                      ))}
                                    </tr>

                                    <tr>
                                      <td className="text-left">ACCESORIOS</td>
                                      {item.detalles.accesorios.map(col => (
                                        <React.Fragment key={v4()}>
                                          {(col.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(col.porcentaje)}>{numberAbs(col.porcentaje)}</td> : null}
                                          <td>{numberWithCommas(col.valor)}</td>
                                        </React.Fragment>
                                      ))}
                                    </tr>

                                    <tr className="bg-gray-300 md:text-xs font-bold">
                                      <td className="text-left " colSpan={isMobile ? 1 : 2}>{!isMobile ? 'Totales ' : ''}{dateHelpers.getEasterDayWeek(item.dia)}</td>
                                      {item.totales.map(col => (
                                        <React.Fragment key={v4()}>
                                          {(col.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(col.porcentaje)}>{numberAbs(col.porcentaje)}</td> : null}
                                          <td>{numberWithCommas(col.valor)}</td>
                                        </React.Fragment>
                                      ))}
                                    </tr>


                                  </React.Fragment>
                                ))
                              : null
                          }
                        </tbody>
                      </table>
                    </div>
                    : null
                }

                {
                  (data && data?.ingresos && data?.segmentos && data.segmentos.length > 0) ?
                    <div>
                      <table className="table-report-grafica">
                        <thead>
                          <tr>
                            <th className="text-left">Tipo</th>
                            <th className="text-left">SEGMENTO</th>
                            <th>{getYearFromDate(reportDate.current)}</th>
                            {reportDate.dateRange[0] ? <th>% VS {reportDate.dateRange[0]}</th> : null}
                            {reportDate.dateRange[0] ? <th>{reportDate.dateRange[0]}</th> : null}
                            {!isDisable ? <th>% VS {reportDate.dateRange[1]}</th> : null}
                            {!isDisable ? <th>{reportDate.dateRange[1]}</th> : null}
                          </tr>
                        </thead>
                        <tbody>
                          {
                            (data && data?.ingresos) ?
                              <>
                                <tr>
                                  <td rowSpan={4} className="text-left text-xs font-bold truncate"> Ingreso Acumulado</td>
                                  <td className="text-left">LINEA</td>
                                  {data.ingresos.totales.linea.map(item => (
                                    <React.Fragment key={v4()}>
                                      {(item.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(item.porcentaje)}>{numberAbs(item.porcentaje)}</td> : null}
                                      <td>{numberWithCommas(item.valor)}</td>
                                    </React.Fragment>

                                  ))}
                                </tr>

                                <tr>
                                  <td className="text-left">MODA</td>
                                  {data.ingresos.totales.moda.map(item => (
                                    <React.Fragment key={v4()}>
                                      {(item.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(item.porcentaje)}>{numberAbs(item.porcentaje)}</td> : null}
                                      <td>{numberWithCommas(item.valor)}</td>
                                    </React.Fragment>
                                  ))}
                                </tr>

                                <tr>
                                  <td className="text-left">ACCESORIOS</td>
                                  {data.ingresos.totales.accesorios.map(item => (
                                    <React.Fragment key={v4()}>
                                      {(item.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(item.porcentaje)}>{numberAbs(item.porcentaje)}</td> : null}
                                      <td>{numberWithCommas(item.valor)}</td>
                                    </React.Fragment>
                                  ))}
                                </tr>

                                <tr>
                                  <td className="text-left">GLOBAL</td>
                                  {data.ingresos.totales.global.map(item => (
                                    <React.Fragment key={v4()}>
                                      {(item.hasOwnProperty('porcentaje')) ? <td data-porcent-format={isNegative(item.porcentaje)}>{numberAbs(item.porcentaje)}</td> : null}
                                      <td>{numberWithCommas(item.valor)}</td>
                                    </React.Fragment>
                                  ))}
                                </tr>

                              </>
                              : null
                          }
                        </tbody>
                      </table>
                    </div>
                    : null
                }
              </div>
            </section>
            :
            null

        }
      </div>

      {isLoading ?
        <>
          <div className="bg-gray-500 opacity-25 w-full h-screen fixed top-0 left-0 z-40" />
          <Loader />
        </>

        : null}
    </>
  );
};

const GraficaWithAuth = withAuth(Grafica);
GraficaWithAuth.getLayout = getVentasLayout;
export default GraficaWithAuth;
