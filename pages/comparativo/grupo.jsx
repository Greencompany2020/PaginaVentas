import { useState, useEffect, Fragment } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { InputContainer, Checkbox, InputDate } from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import { handleChange } from "../../utils/handlers";
import { getComparativoGrupo } from "../../services/ComparativoService";
import { formatNumber, numberWithCommas, stringFormatNumber, tdFormatNumber } from "../../utils/resultsFormated";
import {
  getBeginCurrentWeekDateRange,
  getMonthByNumber,
  getNameDay,
  getPrevDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  getDayWeekName,
  validateDate,
  getTableName,
  rowColor,
  spliceByRegion,
  getShopNameByRegion
} from "../../utils/functions";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import {useNotification} from '../../components/notifications/NotificationsProvider';
import Stats from "../../components/Stats";
import { v4 } from "uuid";
import ViewFilter from "../../components/ViewFilter";
import { isMobile } from "react-device-detect";

function Grupo(props) {
  const {config} = props;
  const sendNotification = useNotification();
  const [comparativoGrupo, setComparativoGrupo] = useState({});
  const [acumuladoSemanal, setAcumuladoSemanal] = useState(false);
  const [displayType, setDisplayType] = useState(1);
  const [selectRegion, setRegion] = useState("REGION I");
  const [comparativoRegion, setComparativoRegion] = useState({});


  const [parametrosGrupo, setParametrosGrupo] = useState({
    fecha: getPrevDate(1),
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    noHorasVentasParciales: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 1,
    tipoCambioTiendas: 0,
  });


  useEffect(()=>{
    setParametrosGrupo(prev => ({
      ...prev,
      conIva: config?.conIva || 0,
      porcentajeVentasCompromiso: config?.porcentajeVentasCompromiso || 0,
      noHorasVentasParciales: config?.noHorasVentasParciales || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      sinAgnoVenta: config?.sinAgnoVenta || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
      resultadosPesos: config?.resultadosPesos || 0,
      tipoCambioTiendas: config?.tipoCambioTiendas || 0,
    }));


    setAcumuladoSemanal(config?.acumuladoSemanal ? true : false);
    setDisplayType((isMobile ? config?.mobileReportView : config?.desktopReportView));
  },[config])

  useEffect(() => {
    (async()=>{
      if(validateDate(parametrosGrupo.fecha)){
        try {
          const response = await getComparativoGrupo(parametrosGrupo);
          setComparativoGrupo(response);
          const formated = spliceByRegion(response)
          setComparativoRegion(formated);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message:response?.response?.data ?? MENSAJE_ERROR,
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosGrupo]);

  return (
    <div className=" flex flex-col h-full ">
      <TitleReport
        title={`COMPARATIVO VENTAS DEL AÑO 
          ${parametrosGrupo.fecha.split("-")[0]} (AL ${
          parametrosGrupo.fecha.split("-")[2]
        } DE ${getMonthByNumber(
          parametrosGrupo.fecha.split("-")[1]
        ).toUpperCase()})`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <div className="flex flex-col justify-between h-full">
          <ParametersContainer>
            <Parameters>
              <InputContainer>
                <InputDate
                  value={parametrosGrupo.fecha}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
              </InputContainer>
              <InputContainer>
              <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.VENTAS_IVA}
                  checked={parametrosGrupo.conIva ? true : false}
                  name={inputNames.CON_IVA}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.VENTAS_VS_COMPROMISO}
                  name={inputNames.PORCENTAJE_COMPROMISO}
                  checked={parametrosGrupo.porcentajeVentasCompromiso ? true : false}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.NO_HORAS_VENTAS_PARCIALES}
                  checked={parametrosGrupo.noHorasVentasParciales ? true : false}
                  name={inputNames.NO_HORAS_VENTAS_PARCIALES}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                  checked={parametrosGrupo.conVentasEventos ? true : false}
                  name={inputNames.CON_VENTAS_EVENTOS}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                  checked={parametrosGrupo.sinAgnoVenta ? true : false}
                  name={inputNames.SIN_AGNO_VENTA}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.ACUMULADO_SEMANAL}
                  checked={acumuladoSemanal ? true : false}
                  name={inputNames.ACUMULADO_SEMANAL}
                  onChange={() => setAcumuladoSemanal((prev) => !prev)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                  name={inputNames.CON_TIENDAS_CERRADAS}
                  checked={parametrosGrupo.conTiendasCerradas ? true : false}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                  name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                  checked={parametrosGrupo.sinTiendasSuspendidas ? true : false}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.RESULTADO_PESOS}
                  name={inputNames.RESULTADOS_PESOS}
                  checked={parametrosGrupo.resultadosPesos ? true : false}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.TIPO_CAMBIO_TIENDAS}
                  checked={parametrosGrupo.tipoCambioTiendas ? true : false}
                  name={inputNames.TIPO_CAMBIO_TIENDAS}
                  onChange={(e) => handleChange(e, setParametrosGrupo)}
                />
              </InputContainer>
            </Parameters>
          </ParametersContainer>
          <p className={`text-sm font-bold ${displayType != 3 && 'hidden'}`}>{getShopNameByRegion(selectRegion)}</p>
        </div>
        <ViewFilter viewOption={displayType} handleView={setDisplayType} selectOption={selectRegion} handleSelect = {setRegion}/>
      </section>


      <section className="p-4 overflow-y-auto ">
        {
          (()=>{
            switch(displayType){
              case 1:
                return <Table data={comparativoGrupo} parameters = {parametrosGrupo} acumuladoSemanal={acumuladoSemanal}/>
              case 2:
                return <Stat data={comparativoGrupo}  parameters = {parametrosGrupo}  acumuladoSemanal={acumuladoSemanal}/>
              case 3:
                return <StatGroup data={comparativoRegion} parameters = {parametrosGrupo} selectRegion={selectRegion} acumuladoSemanal={acumuladoSemanal}/>
              case 4:
                return <TableMobil data={comparativoGrupo} parameters = {parametrosGrupo} acumuladoSemanal={acumuladoSemanal}/>
              default:
                return <Table data={comparativoGrupo} parameters = {parametrosGrupo} acumuladoSemanal={acumuladoSemanal}/>
            }
          })()
        }
      </section>
    </div>
  );
}

const Stat = ({data, parameters, acumuladoSemanal}) => {
  const { dateRangeText } = getBeginCurrentWeekDateRange(parameters.fecha);
  return(
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    {Object.entries(data ?? {})?.map(([key, value])=>(
      (()=>{
        if(value){
          const count = value.length - 1;
          const Item = value.map((tienda, index) => {
            const acumDia =  {
              columnTitle: getNameDay(parameters.fecha) +' '+ getDayWeekName(parameters.fecha),
              values:[
                {
                  caption:getYearFromDate(parameters.fecha),
                  value:numberWithCommas(tienda.ventasActuales)
                },
                {
                  caption:Number(getYearFromDate(parameters.fecha)) - 1,
                  value:numberWithCommas(tienda.ventasAnterior)
                },
                {
                  caption:'PPTO.',
                  value:numberWithCommas(tienda.presupuesto)
                },
                {
                  caption:'%',
                  value:stringFormatNumber(tienda.porcentaje, count == index)
                }
              ]
            }

            const acumSem = {
              columnTitle:'Semana del ' + dateRangeText,
              values:[
                {
                  caption:getYearFromDate(parameters.fecha),
                  value:numberWithCommas(tienda.ventasSemanalesActual)
                },
                {
                  caption:Number(getYearFromDate(parameters.fecha)) - 1,
                  value:numberWithCommas(tienda?.ventasSemanalesAnterior)
                },
                {
                  caption:'PPTO.',
                  value:numberWithCommas(tienda?.presupuestoSemanal)
                },
                {
                  caption: '%',
                  value:stringFormatNumber(tienda?.porcentajeSemanal, count == index)
                }
              ]
            }

            const acumMes =  {
              columnTitle: 'Acumulado' +' '+ getMonthByNumber(parameters.fecha.split("-")[1]),
              values:[
                {
                  caption:getYearFromDate(parameters.fecha),
                  value:numberWithCommas(tienda.ventasMensualesActual)
                },
                {
                  caption:Number(getYearFromDate(parameters.fecha)) - 1,
                  value:numberWithCommas(tienda.ventasMensualesAnterior)
                },
                {
                  caption:'PPTO.',
                  value:numberWithCommas(tienda.presupuestoMensual)
                },
                {
                  caption:'(-)',
                  value:stringFormatNumber(tienda.diferenciaMensual, count == index)
                },
                {
                  caption:'%',
                  value:stringFormatNumber(tienda.porcentajeMensual, count == index)
                }
              ]
            }

            const acmumAnual =  {
              columnTitle: 'Acumulado Anual',
              values:[
                {
                  caption:getYearFromDate(parameters.fecha),
                  value:numberWithCommas(tienda.ventasAnualActual)
                },
                {
                  caption:Number(getYearFromDate(parameters.fecha)) - 1,
                  value:numberWithCommas(tienda.ventasAnualAnterior)
                },
                {
                  caption:'PPTO.',
                  value:numberWithCommas(tienda.presupuestoAnual)
                },
                {
                  caption:'(-)',
                  value:stringFormatNumber(tienda.diferenciaAnual, count == index)
                },
                {
                  caption:'%',
                  value:stringFormatNumber(tienda.porcentajeAnual, count == index)
                }
              ]
            }


            return(
              <Stats
              key={index}
              title={tienda.tienda}
              expand={acumuladoSemanal ? true : false}
              columns={[
                acumDia,
                acumuladoSemanal && acumSem,
                acumMes,
                acmumAnual 
              ]}
            />
            )
          });
          return Item
        }
      })()
    ))}
  </div>
  )
}

const StatGroup = ({data, parameters, selectRegion, acumuladoSemanal}) => {
  const { dateRangeText } = getBeginCurrentWeekDateRange(parameters.fecha);
  return(
    <div className={`grid grid-cols-1 ${acumuladoSemanal ? 'xl:grid-cols-4' : 'xl:grid-cols-3'} gap-4`} key={12}>
      {
        (()=>{
          if(Array(data).length > 0){
            const acumDia = data[selectRegion]?.map(tienda => (
              {
                columnTitle: tienda.tienda,
                values:[
                  {
                    caption:getYearFromDate(parameters.fecha),
                    value:numberWithCommas(tienda.ventasActuales)
                  },
                  {
                    caption:Number(getYearFromDate(parameters.fecha)) - 1,
                    value:numberWithCommas(tienda.ventasAnterior)
                  },
                  {
                    caption:'PPTO.',
                    value:numberWithCommas(tienda.presupuesto)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentaje)
                  }
                ]
              }
            ));
            const acumSem = data[selectRegion]?.map(tienda =>(
              {
                columnTitle: tienda.tienda,
                values:[
                  {
                    caption:getYearFromDate(parameters.fecha),
                    value:numberWithCommas(tienda.ventasSemanalesActual)
                  },
                  {
                    caption:Number(getYearFromDate(parameters.fecha)) - 1,
                    value:numberWithCommas(tienda.ventasSemanalesAnterior)
                  },
                  {
                    caption:'PPTO.',
                    value:numberWithCommas(tienda.presupuestoSemanal)
                  },
                  {
                    caption: '%',
                    value:stringFormatNumber(tienda.porcentajeSemanal)
                  }
                ]
              }
            ))
            const acumMes = data[selectRegion]?.map(tienda => (
              {
                columnTitle: tienda.tienda,
                values:[
                  {
                    caption:getYearFromDate(parameters.fecha),
                    value:numberWithCommas(tienda.ventasMensualesActual)
                  },
                  {
                    caption:Number(getYearFromDate(parameters.fecha)) - 1,
                    value:numberWithCommas(tienda.ventasMensualesAnterior)
                  },
                  {
                    caption:'PPTO.',
                    value:numberWithCommas(tienda.presupuestoMensual)
                  },
                  {
                    caption:'(-)',
                    value:stringFormatNumber(tienda.diferenciaMensual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentajeMensual)
                  }
                ]
              }
            ));
            const acumAnual = data[selectRegion]?.map(tienda => (
              {
                columnTitle: tienda.tienda,
                values:[
                  {
                    caption:getYearFromDate(parameters.fecha),
                    value:numberWithCommas(tienda.ventasAnualActual)
                  },
                  {
                    caption:Number(getYearFromDate(parameters.fecha)) - 1,
                    value:numberWithCommas(tienda.ventasAnualAnterior)
                  },
                  {
                    caption:'PPTO.',
                    value:numberWithCommas(tienda.presupuestoAnual)
                  },
                  {
                    caption:'(-)',
                    value:stringFormatNumber(tienda.diferenciaAnual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentajeAnual)
                  }
                ]
              }
            ))

            return (
              
              <Fragment key={v4()}>
                
                <Stats
                  title= {getNameDay(parameters.fecha) +' '+ getDayWeekName(parameters.fecha)}
                  columns={(acumDia && [...acumDia])}
                  expand={false}
                />
                { acumuladoSemanal &&
                  <Stats
                    title= {'Acumulado ' + dateRangeText}
                    columns={(acumSem && [...acumSem])}
                    expand={false}
                  />
                }
                <Stats
                  title= {'Acumulado' +' '+ getMonthByNumber(parameters.fecha.split("-")[1])}
                  columns={(acumMes && [...acumMes])}
                  expand={false}
                />
                  <Stats
                  title= {'Acumulado anual'}
                  columns={(acumAnual && [...acumAnual])}
                  expand={false}
                />
              </Fragment>
            )
          }
        })()
      }
    </div>
  )
}

const Table = ({data, parameters, acumuladoSemanal}) =>{
  const { dateRangeText } = getBeginCurrentWeekDateRange(parameters.fecha);
  return (
    <VentasTableContainer>
      {Object?.entries(data ?? {})?.map(([key, value]) => (
        <Fragment key={key}>
          {getTableName(key)}
          <VentasTable className="last-row-bg mb-4">
            <TableHead>
              <tr>
                <th rowSpan={2} className="bg-black-shape rounded-tl-xl">
                  Tienda
                </th>
                <th colSpan={4} className="bg-black-shape">
                  {getNameDay(parameters.fecha)}{" "}
                  {getDayWeekName(parameters.fecha)}
                </th>
                {acumuladoSemanal && (
                  <th colSpan={4}>Semana Del {dateRangeText}</th>
                )}
                <th colSpan={5} className="bg-black-shape">
                  Acumulado{" "}
                  {getMonthByNumber(parameters.fecha.split("-")[1])}
                </th>
                <th colSpan={5} className="bg-black-shape">
                  Acumlado Anual
                </th>
                <th rowSpan={2} className="bg-black-shape rounded-tr-xl">
                  Tienda
                </th>
              </tr>
              <tr className="text-right">
                <th className="bg-black-shape">
                  {getYearFromDate(parameters.fecha)}
                </th>
                <th className="bg-black-shape">
                  {Number(getYearFromDate(parameters.fecha)) - 1}
                </th>
                <th className="bg-black-shape">PPTO.</th>
                <th className="bg-black-shape">%</th>
                {acumuladoSemanal && (
                  <>
                    <th className="bg-black-shape">
                      {getYearFromDate(parameters.fecha)}
                    </th>
                    <th className="bg-black-shape">
                      {Number(getYearFromDate(parameters.fecha)) - 1}
                    </th>
                    <th className="bg-black-shape">PPTO.</th>
                    <th className="bg-black-shape">%</th>
                  </>
                )}
                <th className="bg-black-shape">
                  {getYearFromDate(parameters.fecha)}
                </th>
                <th className="bg-black-shape">
                  {Number(getYearFromDate(parameters.fecha)) - 1}
                </th>
                <th className="bg-black-shape">PPTO.</th>
                <th className="bg-black-shape">(-)</th>
                <th className="bg-black-shape">%</th>
                <th className="bg-black-shape">
                  {getYearFromDate(parameters.fecha)}
                </th>
                <th className="bg-black-shape">
                  {Number(getYearFromDate(parameters.fecha)) - 1}
                </th>
                <th className="bg-black-shape">PPTO.</th>
                <th className="bg-black-shape">(-)</th>
                <th className="bg-black-shape">%</th>
              </tr>
            </TableHead>
            <tbody className="text-xs text-right bg-white text-black">
              {
                (()=>{
                  if(value){
                    const count = value.length - 1;
                    const Items = value?.map((tienda, index) => (
                      <TableRow
                        key={tienda.tienda}
                        rowId={tienda.tienda}
                        className={rowColor(tienda)}
                      >
                        <td className="text-left">{tienda.tienda}</td>
                        <td className="font-bold">
                          {numberWithCommas(tienda.ventasActuales)}
                        </td>
                        <td>{numberWithCommas(tienda.ventasAnterior)}</td>
                        <td>{numberWithCommas(tienda.presupuesto)}</td>
                        {formatNumber(tienda.porcentaje, count == index)}
                        {acumuladoSemanal && (
                          <>
                            <td>
                              {numberWithCommas(tienda.ventasSemanalesActual)}
                            </td>
                            <td c>
                              {numberWithCommas(tienda.ventasSemanalesAnterior)}
                            </td>
                            <td>{numberWithCommas(tienda.presupuestoSemanal)}</td>
                            {formatNumber(tienda.porcentajeSemanal, count == index)}
                          </>
                        )}
                        <td className="font-bold">
                          {numberWithCommas(tienda.ventasMensualesActual)}
                        </td>
                        <td>
                          {numberWithCommas(tienda.ventasMensualesAnterior)}
                        </td>
                        <td>{numberWithCommas(tienda.presupuestoMensual)}</td>
                        {formatNumber(tienda.diferenciaMensual, count == index)}
                        {formatNumber(tienda.porcentajeMensual, count == index)}
                        <td className="font-bold">
                          {numberWithCommas(tienda.ventasAnualActual)}
                        </td>
                        <td>{numberWithCommas(tienda.ventasAnualAnterior)}</td>
                        <td>{numberWithCommas(tienda.presupuestoAnual)}</td>
                        {formatNumber(tienda.diferenciaAnual, count == index)}
                        {formatNumber(tienda.porcentajeAnual, count == index)}
                        <td className="text-left pl-3">{tienda.tienda}</td>
                      </TableRow>
                    ));
                  return Items;
                  }
                })()
              }
            </tbody>
          </VentasTable>
        </Fragment>
      ))}
    </VentasTableContainer>
  )
}

const TableMobil  =  ({data, parameters, acumuladoSemanal}) =>{
  const { dateRangeText } = getBeginCurrentWeekDateRange(parameters.fecha);
  return (
    <section>
      {Object?.entries(data ?? {})?.map(([key, value]) => (
        <Fragment key={key}>
          {getTableName(key)}
          <table className="mobile-table mb-8">
            <caption className="text-blue-500 font-bold mb-1 uppercase"> {getNameDay(parameters.fecha)}{" "}{getDayWeekName(parameters.fecha)}</caption>
            <thead className="text-right text-xs">
              <tr>
                <th className="text-center">Tienda</th>
                <th className="bg-gray-100"> {getYearFromDate(parameters.fecha)}</th>
                <th>{getYearFromDate(parameters.fecha)-1}</th>
                <th>PPTO</th>
                <th colSpan={2}>%</th>
              </tr>
            </thead>
            <tbody className="text-xs">
            {
              (()=>{
                if(value){
                  const count = value.length - 1;
                  const Items = value?.map((tienda, index) => (
                    <TableRow
                      key={tienda.tienda}
                      rowId={tienda.tienda}
                      className={rowColor(tienda)}
                    >
                      <td className="text-left">{tienda.tienda}</td>
                      <td className="font-bold text-right" >{numberWithCommas(tienda.ventasActuales)}</td>
                      <td className="text-right">{numberWithCommas(tienda.ventasAnterior)}</td>
                      <td className="text-right">{numberWithCommas(tienda.presupuesto)}</td>
                      {tdFormatNumber(tienda.porcentaje, count == index)}
                    </TableRow>
                  ));
                return Items;
                }
              })()
            }
            </tbody>
          </table>

          {
            acumuladoSemanal &&
            <table className="mobile-table mb-8">
              <caption className="text-blue-500 font-bold mb-1 uppercase"> {'Acumulado ' + dateRangeText}</caption>
              <thead className="text-right text-xs">
                <tr>
                  <th className="text-center">Tienda</th>
                  <th className="bg-gray-100"> {getYearFromDate(parameters.fecha)}</th>
                  <th>{getYearFromDate(parameters.fecha)-1}</th>
                  <th>PPTO</th>
                  <th colSpan={2}>%</th>
                </tr>
              </thead>
              <tbody className="text-xs">
                {
                  (()=>{
                    if(value){
                      const count = value.length - 1;
                      const Items = value?.map((tienda, index) => (
                        <TableRow
                          key={tienda.tienda}
                          rowId={tienda.tienda}
                          className={rowColor(tienda)}
                        >
                          <td className="text-left">{tienda.tienda}</td>
                          <td className="font-bold text-right" >{numberWithCommas(tienda.ventasSemanalesActual)}</td>
                          <td className="text-right">{numberWithCommas(tienda.ventasSemanalesAnterior)}</td>
                          <td className="text-right">{numberWithCommas(tienda.presupuestoSemanal)}</td>
                          {tdFormatNumber(tienda.porcentajeSemanal, count == index)}
                        </TableRow>
                      ));
                    return Items;
                    }
                  })()
                }
              </tbody>
            </table>
          }

          <table className="mobile-table mb-8">
            <caption className="text-blue-500 font-bold mb-1 uppercase"> Acumulado{" "}{getMonthByNumber(parameters.fecha.split("-")[1])}</caption>
            <thead className="text-right text-xs">
              <tr>
                <th className="text-center">Tienda</th>
                <th className="bg-gray-100"> {getYearFromDate(parameters.fecha)}</th>
                <th>{getYearFromDate(parameters.fecha)-1}</th>
                <th>PPTO</th>
                <th>(-)</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody className="text-xs">
            {
              (()=>{
                if(value){
                  const count = value.length - 1;
                  const Items = value?.map((tienda, index) => (
                    <TableRow
                      key={tienda.tienda}
                      rowId={tienda.tienda}
                      className={rowColor(tienda)}
                    >
                      <td className="text-left">{tienda.tienda}</td>
                      <td className="font-bold text-right" >{numberWithCommas(tienda.ventasMensualesActual)}</td>
                      <td className="text-right">{numberWithCommas(tienda.ventasMensualesAnterior)}</td>
                      <td className="text-right">{numberWithCommas(tienda.presupuestoMensual)}</td>
                        {tdFormatNumber(tienda.diferenciaMensual, count == index)}
                        {tdFormatNumber(tienda.porcentajeMensual, count == index)}
                    </TableRow>
                  ));
                return Items;
                }
              })()
            }
            </tbody>
          </table>

          <table className="mobile-table mb-8">
            <caption className="text-blue-500 font-bold mb-1 uppercase">Acumulado Anual</caption>
            <thead className="text-right text-xs">
              <tr>
                <th className="text-center">Tienda</th>
                <th className="bg-gray-100"> {getYearFromDate(parameters.fecha)}</th>
                <th>{getYearFromDate(parameters.fecha)-1}</th>
                <th>PPTO</th>
                <th>(-)</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody className="text-xs">
            {
              (()=>{
                if(value){
                  const count = value.length - 1;
                  const Items = value?.map((tienda, index) => (
                    <TableRow
                      key={tienda.tienda}
                      rowId={tienda.tienda}
                      className={rowColor(tienda)}
                    >
                      <td className="text-left">{tienda.tienda}</td>
                      <td className="font-bold text-right" >{numberWithCommas(tienda.ventasAnualActual)}</td>
                      <td className="text-right">{numberWithCommas(tienda.ventasAnualAnterior)}</td>
                      <td className="text-right">{numberWithCommas(tienda.presupuestoAnual)}</td>
                      {tdFormatNumber(tienda.diferenciaAnual, count == index)}
                      {tdFormatNumber(tienda.porcentajeAnual, count == index)}
                    </TableRow>
                  ));
                return Items;
                }
              })()
            }
            </tbody>
          </table>
        </Fragment>
      ))}
    </section>
  )
}

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
