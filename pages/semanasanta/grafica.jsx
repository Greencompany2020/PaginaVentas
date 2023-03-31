import React, { useState } from "react";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import { checkboxLabels, inputNames, comboValues } from "../../utils/data";
import {
  getCurrentDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  parseNumberToBoolean,
  parseToNumber,
  spliteArrDate,
  isSecondDateBlock,
  getInitialPlaza,
  getInitialTienda
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


const Grafica = (props) => {

  const { config } = props;
  const { places, shops } = useSelector(state => state);
  const sendNotification = useNotification();
  const dateHelpers = DateHelper();
  const [data, setData] = useState(null);
  const [dataSet, setDataSet] = useState({ labels: [], datasets: [] });
  const [reportDate, setReportDate] = useState({ current: getCurrentDate(true), dateRange: spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1) });
  const [isDisable, setIsDisable] = useState(isSecondDateBlock(config?.cbAgnosComparar || 1));
  const [showDetail, setShowDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const parameters = {
    fecha: dateHelpers.getCurrent(),
    tienda: getInitialTienda(shops),
    empresa: getInitialPlaza(places),
    conIva: parseNumberToBoolean(config?.conIva || 0),
    conVentasEventos: parseNumberToBoolean(config?.conVentasEventos || 0),
    incluirFinSemanaAnterior: parseNumberToBoolean(config?.incluirFinSemanaAnterior || 0),
    resultadosPesos: parseNumberToBoolean(config?.resultadosPesos || 0),
    mostrarTiendas: config?.mostrarTiendas || 'activas',
    tipoCambioTiendas: parseNumberToBoolean(config?.tipoCambioTiendas || 0),
    agnosComparar: spliteArrDate(config?.agnosComparativos, config?.cbAgnosComparar || 1),
    cbAgnosComparar: config?.cbAgnosComparar || 1,
    mostrarDetalle: parseNumberToBoolean(0),
    tipo: 'grupo'
  }

  const handleSubmit = async values => {
    try {
      const params = removeParams(values);
      const { agnosComparar, fecha, } = params;
      const { cbAgnosComparar, agnosComparar: [first, last] } = values
      const colors = ['#006400', '#daa520', '#6495ed'];

      setIsLoading(true);
      const result = await getSemanaSantaGrafica(params);
      setData(result);

      const labelDays = result.lista
        .filter(list => list.dia !== 'Porcentaje' && list.dia !== 'Total')
        .flatMap(item => dateHelpers.getDayFromEasterWeek(item.dia));

      const currentYear = dateHelpers.getYearFromEasterWeek(fecha);
      const years = [currentYear, ...agnosComparar];

      const dataSets = years.map((date, i) => {
        const dataInDate = result.lista
          .filter(item => item.dia !== 'Porcentaje' && item.dia !== 'Total')
          .flatMap(itemFilter => itemFilter.datos.filter(secondFilter => secondFilter.agno === date))
          .flatMap(flatItem => flatItem.valor)
        return {
          label: date,
          data: dataInDate,
          backgroundColor: colors[i],
        }
      });

      setDataSet({ labels: labelDays, datasets: dataSets })

      setReportDate({
        current: fecha,
        dateRange: cbAgnosComparar == 1 ? [first] : [first, last]
      })

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
      mostrarDetalle,
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
      agnosComparar: cbAgnosComparar == 1 ? [first] : [first, last],
      tipo: params.tipo,
      mostrarTiendas: params.mostrarTiendas
    }

    setShowDetail(mostrarDetalle);

    return rest;
  }

  const calculateCols = (itemName) => {
    if (itemName === 'Porcentaje') {
      return 2
    } else {
      return 0
    }
  }

  const onChangeValue = (e) => {
    const {name, value} = e.target;
    if(name === 'cbAgnosComparar'){
      setIsDisable(isSecondDateBlock(value));
    }

    if(name === 'mostrarDetalle'){
      const val = value === 'true' ? true : false
      setShowDetail(val);
    }
  }


  return (
    <>
      <div className=" flex flex-col h-full">
        <TitleReport title={`Ventas Semana Santa del año ${reportDate.current}`} />
        <section className="p-4 flex flex-row justify-between items-baseline">
          <ParametersContainer>
            <Parameters>
              <Formik initialValues={parameters} onSubmit={handleSubmit} enableReinitialize>
                <Form onChange={onChangeValue}>

                  <Input type={'date'} placeholder={"Hola"} id='fecha' name='fecha' label='Fecha' />
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
                    <Checkbox id={'mostrarDetalle'} name={'mostrarDetalle'} label={checkboxLabels.MOSTRAR_DETALLES} />
                  </fieldset>
                  <div className="mt-4">
                    <input type="submit" value="Buscar" className="primary-btn w-full disabled:bg-gray-500" disabled={isLoading} />
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
                <table className="table-report-footer">
                  <thead>
                    <tr>
                      <th className="text-left">DIA REF</th>
                      <th>{getYearFromDate(reportDate.current)}</th>
                      {reportDate.dateRange[0] ? <th>{reportDate.dateRange[0]}</th> : null}
                      {reportDate.dateRange[1] ? <th>{reportDate.dateRange[1]}</th> : null}
                    </tr>
                  </thead>
                  <tbody>
                    {
                      (data && data?.lista) ?
                        data.lista
                          .map(item => (
                            <tr key={v4()} className={`${(item.dia === 'Total') ?
                              'bg-orange-400 text-white text-sm font-bold'
                              : (item.dia === 'Porcentaje') ?
                                'bg-orange-200 text-sm font-bold'
                                : ''
                              }`}>
                              <td className="text-left">{dateHelpers.getEasterDayWeek(item.dia)}</td>
                              {item.datos
                                .map(col => (
                                  item.dia !== 'Porcentaje' ?
                                    <td key={v4()} colSpan={calculateCols(item.dia)}>
                                      {numberWithCommas(col.valor)}
                                    </td>
                                    :
                                    <td key={v4()} colSpan={calculateCols(item.dia)} data-porcent-format={isNegative(col.valor)}>
                                      {numberAbs(col.valor)}
                                    </td>
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
                (showDetail) ?
                  <div>
                    <table className="table-report-footer">
                      <thead>
                        <tr>
                          <th className="text-left">DIA REF</th>
                          <th className="text-left">SEGMENTO</th>
                          <th>{getYearFromDate(reportDate.current)}</th>
                          {reportDate.dateRange[0] ? <th>{reportDate.dateRange[0]}</th> : null}
                          {reportDate.dateRange[1] ? <th>{reportDate.dateRange[1]}</th> : null}
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (data && data?.segmentos) ?
                            data.segmentos
                              .map(item => (
                                <React.Fragment key={v4()}>
                                  <tr>
                                    <td className="text-left font-bold text-sm" rowSpan={3}>{dateHelpers.getEasterDayWeek(item.dia)}</td>
                                    <td className="text-left">LINEA</td>
                                    {item.detalles.linea.map(col => (<td key={v4()}>{numberWithCommas(col.valor)}</td>))}
                                  </tr>

                                  <tr>
                                    <td className="text-left">MODA</td>
                                    {item.detalles.moda.map(col => (<td key={v4()}>{numberWithCommas(col.valor)}</td>))}
                                  </tr>

                                  <tr>
                                    <td className="text-left">ACCESORIOS</td>
                                    {item.detalles.accesorios.map(col => (<td key={v4()}>{numberWithCommas(col.valor)}</td>))}
                                  </tr>

                                  <tr className="bg-orange-400 text-white text-sm font-bold">
                                    <td className="text-left " colSpan={2}>Totales {dateHelpers.getEasterDayWeek(item.dia)}</td>
                                    {item.totales.map(col => (<td key={v4()}>{numberWithCommas(col.valor)}</td>))}
                                  </tr>

                                  <tr className=" border-b border-b-black bg-orange-200 text-sm font-bold">
                                    <td></td>
                                    <td className="text-left">%Var</td>
                                    {item.porcentajes.map(col => (<td key={v4()} colSpan={1} data-porcent-format={isNegative(col.valor)}>{numberAbs(col.valor)}</td>))}
                                    <td></td>
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
                (showDetail) ?
                  <div>
                    <table className="table-report-footer">
                      <thead>
                        <tr>
                          <th className="text-left">Tipo</th>
                          <th className="text-left">SEGMENTO</th>
                          <th>{getYearFromDate(reportDate.current)}</th>
                          {reportDate.dateRange[0] ? <th>{reportDate.dateRange[0]}</th> : null}
                          {reportDate.dateRange[1] ? <th>{reportDate.dateRange[1]}</th> : null}
                        </tr>
                      </thead>
                      <tbody>
                        {
                          (data && data.ingresos && showDetail) ?
                            <>
                              <tr>
                                <td rowSpan={3} className="text-left text-sm font-bold"> Ingreso Acumulado</td>
                                <td className="text-left">LINEA</td>
                                {data.ingresos.totales.linea.map(item => (<td key={v4()}>{numberWithCommas(item.valor)}</td>))}
                              </tr>

                              <tr>
                                <td className="text-left">MODA</td>
                                {data.ingresos.totales.moda.map(item => (<td key={v4()}>{numberWithCommas(item.valor)}</td>))}
                              </tr>

                              <tr>
                                <td className="text-left">ACCESORIOS</td>
                                {data.ingresos.totales.accesorios.map(item => (<td key={v4()}>{numberWithCommas(item.valor)}</td>))}
                              </tr>

                              <tr className="border-t">
                                <td rowSpan={3} className="text-left text-sm font-bold">% Var</td>
                                <td className="text-left">LINEA</td>
                                {data.ingresos.porcentajes.linea.map(item => (<td key={v4()} colSpan={1} data-porcent-format={isNegative(item.valor)}>{numberAbs(item.valor)}</td>))}
                              </tr>

                              <tr>
                                <td className="text-left">MODA</td>
                                {data.ingresos.porcentajes.moda.map(item => (<td key={v4()} colSpan={1} data-porcent-format={isNegative(item.valor)}>{numberAbs(item.valor)}</td>))}
                              </tr>

                              <tr>
                                <td className="text-left">ACCESORIOS</td>
                                {data.ingresos.porcentajes.accesorios.map(item => (<td key={v4()} colSpan={1} data-porcent-format={isNegative(item.valor)}>{numberAbs(item.valor)}</td>))}
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
          <div className="w-full h-full text-center">
            <h1 className="text-xl">Sin datos para mostrar</h1>
            <p>(Abrir los filtros y presionar buscar)</p>
          </div>
          
        }
      </div>

      {isLoading ?
        <>
          <div className="bg-gray-500 opacity-25 w-full h-screen fixed top-0 left-0 z-30" />
          <Loader />
        </>

        : null}
    </>
  );
};

const GraficaWithAuth = withAuth(Grafica);
GraficaWithAuth.getLayout = getVentasLayout;
export default GraficaWithAuth;
