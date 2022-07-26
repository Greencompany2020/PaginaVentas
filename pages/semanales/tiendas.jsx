import React, { useState, useEffect, Fragment } from "react";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow
} from "../../components/table";
import {
  InputContainer,
  InputDateRange,
  Checkbox,
  SelectTiendasGeneral,
  SelectTiendasCombo,
  SelectCompromiso,
  InputDateComparative
} from "../../components/inputs";
import RegionesPlazaTableRow from "../../components/table/RegionesPlazaTableRow";
import {
  regiones,
  checkboxLabels,
  plazas,
  MENSAJE_ERROR,
} from "../../utils/data";
import {
  getCurrentWeekDateRange,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  dateRangeTitle,
  validateInputDateRange,
  rowRegion,
  spliceData,
  spliteArrDate
} from "../../utils/functions";
import { getSemanalesTiendas } from "../../services/SemanalesService";
import { inputNames } from "../../utils/data/checkboxLabels";
import { handleChange } from "../../utils/handlers";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import Stats from "../../components/Stats";
import { numberWithCommas, stringFormatNumber, tdFormatNumber, formatNumber} from "../../utils/resultsFormated";
import { isMobile } from "react-device-detect";
import ViewFilter from "../../components/ViewFilter";
import { v4 } from "uuid";
import ExcelButton from "../../components/buttons/ExcelButton";
import semTienda from "../../utils/excel/templates/semtTienda";
import exportExcel from "../../utils/excel/exportExcel";

const Tiendas = (props) => {
  const {config} = props;
  const currentYear = new Date(Date.now()).getFullYear();
  const sendNotification = useNotification();
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [semanalesRegion, setSemanalesRegion] = useState({});
  const [semanalesTienda, setSemanalesTienda] = useState([]);
  const [selectRegion, setRegion] = useState(null);
  const [displayType, setDisplayType] = useState(1);
  const [seccion, setSeccion] = useState([]);

  const [cbAgnosComparar, setCbAgnosComparar] = useState(1);
  const [tiendasParametros, setTiendasParametros] = useState({
    fechaInicio: beginDate,
    fechaFin: endDate,
    tiendas: 0,
    conIva: 1,
    conVentasEventos: 0,
    resultadosPesos: 0,
    incremento: 'compromiso',
    mostrarTiendas: 'activas',
    agnosComparar: [currentYear - 1,currentYear - 2],
    tipoCambioTiendas: 0,
  });

  useEffect(()=>{
    setTiendasParametros(prev => ({
      ...prev,
      conIva: config?.conIva || 0,
      conVentasEventos:  config?.conVentasEventos || 0,
      resultadosPesos: 0,
      agnosComparar: spliteArrDate(config.agnosComparativos, config?.cbAgnosComparar || 1),
    }));

    setDisplayType((isMobile ? config?.mobileReportView : config?.desktopReportView));
    setCbAgnosComparar(config?.cbAgnosComparar || 1)
  },[config])

  useEffect(() => {
    (async()=>{
      if (validateInputDateRange(tiendasParametros.fechaInicio,tiendasParametros.fechaFin)){
        try {
          let seccionesTemp = null
          const response = await getSemanalesTiendas(tiendasParametros);
          setSemanalesTienda(response);
          switch(tiendasParametros.tiendas){
            case 0:
              seccionesTemp = ['REGION I', 'REGION II', 'REGION III', 'GRUPO'];
              break;
            case 2:
              seccionesTemp = ['SK MAZATLAN', 'SK CULIACAN', 'SK MEXICALI', 'SK CHIHUAHUA', 'SK TIJUANA', 'SIN REGION', 'GRUPO', ];
              break;
            case 3:
              seccionesTemp = ['WEB', 'SIN REGION' ,'GRUPO']
              break;
            default:
              seccionesTemp = null;
              break;
          }
          const formated = spliceData(response, seccionesTemp);
          setSemanalesRegion(formated);
          setRegion(seccionesTemp[0]);
          setSeccion(seccionesTemp);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros, cbAgnosComparar]);

  const getRegionName =  () =>{
    switch(tiendasParametros.tiendas){
      case 0:
       return 'Tiendas Frogs'
      case 2:
       return 'Skoro'
      case 3:
       return 'Web'
      default:
        return 'Tiendas Frogs'
    }
  }

  const handleExport = () => {
    const template = semTienda();
    exportExcel('semanales plaza',template.columns,[...semanalesTienda],template.format)
  }

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Detalles de información / Semanales por Tienda" />

      <section className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <ParametersContainer>
            <Parameters>
              <InputContainer>
                <SelectTiendasGeneral
                  value={tiendasParametros.tiendas}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
                <InputDateRange
                  beginDate={tiendasParametros.fechaInicio}
                  endDate={tiendasParametros.fechaFin}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
                <InputDateComparative
                  cbEnabledYears={cbAgnosComparar}
                  changeEnabled={setCbAgnosComparar}
                  firstYear={tiendasParametros.agnosComparar[0]}
                  secondYear={tiendasParametros.agnosComparar[1]}
                  onChange = {setTiendasParametros}
                />
                <SelectCompromiso
                  value={tiendasParametros.incremento}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
                <SelectTiendasCombo
                  value={tiendasParametros.mostrarTiendas}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
              </InputContainer>
              <InputContainer>
                <Checkbox
                  labelText={checkboxLabels.VENTAS_IVA}
                  checked={tiendasParametros.conIva ? true : false}
                  name={inputNames.CON_IVA}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
                <Checkbox
                  labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                  checked={tiendasParametros.conVentasEventos ? true : false}
                  name={inputNames.CON_VENTAS_EVENTOS}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
                <Checkbox
                  labelText={checkboxLabels.RESULTADO_PESOS}
                  checked={tiendasParametros.resultadosPesos ? true : false}
                  name={inputNames.RESULTADOS_PESOS}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
              </InputContainer>
            </Parameters>
          </ParametersContainer>
          <ViewFilter 
            viewOption={displayType} 
            handleView={setDisplayType} 
            selectOption={selectRegion} 
            handleSelect = {setRegion}
            options={seccion}
          />
        </div>
        <div className="flex justify-between">
          <p className={`text-sm font-bold `}>{ getRegionName()}</p>
          <ExcelButton  handleClick={handleExport}/>
        </div>
      </section>

      <section className="p-4 overflow-y-auto ">
        {
          (()=>{
              switch(displayType){
                case 1:
                  return <Table tiendasParametros={tiendasParametros} semanalesTienda={semanalesTienda}/>
                case 2:
                  return <Stat tiendasParametros={tiendasParametros} semanalesTienda={semanalesTienda}/>
                case 3:
                  return <StatGroup data={semanalesRegion} tiendasParametros={tiendasParametros} selectRegion ={selectRegion}/>;
                case 4:
                  return <TableMobil tiendasParametros={tiendasParametros} semanalesTienda={semanalesTienda}/>
                default:
                  return <Table tiendasParametros={tiendasParametros} semanalesTienda={semanalesTienda}/>
              }
          })()
        }
      </section>
    </div>
  );
};

const Table = ({tiendasParametros, semanalesTienda}) => {
  const years = [
    ... new 
    Set([...tiendasParametros.agnosComparar])
  ].sort((a, b) => b - a);
  const count = semanalesTienda.length - 1;

  return(
    <VentasTableContainer>
      <VentasTable className="tfooter">
        <TableHead>
          <tr>
            <td rowSpan={3} className="border border-white bg-black-shape rounded-tl-xl">Plaza</td>
            <td colSpan={15 + (years.length == 2 ? 8 : 0)} className="border border-white bg-black-shape rounded-tr-xl">
              {dateRangeTitle(
                tiendasParametros.fechaInicio,
                tiendasParametros.fechaFin
              )}
            </td>
          </tr>
          <tr className="text-right">
            <td rowSpan={2} className="border border-white bg-black-shape">Comp</td>
            <td rowSpan={2} className="border border-white bg-black-shape">
              {getYearFromDate(tiendasParametros.fechaFin)}
            </td>
            {
              years.map(year => (
                <React.Fragment key={v4()}>
                  <td rowSpan={2} className="border border-white bg-black-shape">%</td>
                  <td rowSpan={2} className="border border-white bg-black-shape">{year}</td>
                </ React.Fragment>
              ))
            }
            <td colSpan={3 + (years.length == 2 ? 3 : 1)} className="border border-white bg-black-shape">operaciones</td>
            <td colSpan={3 + (years.length == 2 ? 3 : 1)} className="border border-white bg-black-shape">promedios</td>
            <td colSpan={3 + (years.length == 2 ? 3 : 1)} className="border border-white bg-black-shape">Articulos Prom.</td>
          </tr>
          <tr className="text-right">
            <td className="border border-white bg-black-shape">Comp</td>
            <td className="border border-white bg-black-shape">
              {getYearFromDate(tiendasParametros.fechaFin)}
            </td>
            {
              years.map(year => (
                <React.Fragment key={v4()}>
                  <td className="border border-white bg-black-shape">%</td>
                  <td className="border border-white bg-black-shape">{year}</td>
                </ React.Fragment>
              ))
            }
            <td className="border border-white bg-black-shape">comp</td>
            <td className="border border-white bg-black-shape">
              {getYearFromDate(tiendasParametros.fechaFin)}
            </td>
            {
              years.map(year => (
                <React.Fragment key={v4()}>
                  <td className="border border-white bg-black-shape">%</td>
                  <td className="border border-white bg-black-shape">{year}</td>
                </ React.Fragment>
              ))
            }
            <td className="border border-white bg-black-shape">
              {getYearFromDate(tiendasParametros.fechaFin)}
            </td>
            {
              years.map(year => (
                <React.Fragment key={v4()}>
                  <td className="border border-white bg-black-shape">%</td>
                  <td className="border border-white bg-black-shape">{year}</td>
                </ React.Fragment>
              ))
            }
          </tr>
        </TableHead>
        <tbody className="text-xs text-right">
          {
            (()=> {
              if(Array.isArray(semanalesTienda) && semanalesTienda.length > 0){
                const Items = semanalesTienda.map((tienda, index) => (
                  <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                    <td className="text-left font-bold">{tienda.plaza}</td>
                    <td>{numberWithCommas(tienda['compromiso' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                    <td className="font-bold">{numberWithCommas(tienda['ventasActuales' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                    {
                      years.map(year => (
                        <React.Fragment key={v4()}>
                          {formatNumber(tienda['porcentaje' + year], count == index, 12)}
                          <td>{numberWithCommas(tienda['ventasActuales' + year])}</td>
                        </React.Fragment>
                      ))
                    }
                   
                    <td className="font-bold">{numberWithCommas(tienda['operacionesComp'+ getYearFromDate(tiendasParametros.fechaFin)])}</td>
                    <td className="font-bold">{numberWithCommas(tienda['operacionesActual'+ getYearFromDate(tiendasParametros.fechaFin)])}</td>
                    {
                      years.map(year => (
                        <React.Fragment key={v4()}>
                          {formatNumber(tienda['porcentajeOperaciones'+ year], count == index, 12)}
                          <td>{numberWithCommas(tienda['operacionesActual'+ year])}</td>
                        </React.Fragment>
                      )) 
                    }
            
    
                    <td className="font-bold">{numberWithCommas(tienda['promedioComp' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                    <td className="font-bold">{numberWithCommas(tienda['promedioActual' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                    {
                      years.map(year => (
                        <React.Fragment key={v4()}>
                          {formatNumber(tienda['porcentajePromedios' + year], count == index, 12)}
                          <td>{numberWithCommas(tienda['promedioActual' + year])}</td>
                        </React.Fragment>
                      ))
                    }
                    
    
                    <td className="font-bold">{numberWithCommas(tienda['articulosActual' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                    {
                      years.map(year => (
                        <React.Fragment key={v4()}>
                          {formatNumber(tienda['articulosPorcentaje' + year], count == index, 12)}
                          <td>{numberWithCommas(tienda['articulosActual' + year])}</td>
                        </React.Fragment>
                      ))
                    }
                   
                  </TableRow>
                ));
                return Items;
              }
            })()
          }
        </tbody>
      </VentasTable>
    </VentasTableContainer>
  )
}

const Stat = ({tiendasParametros, semanalesTienda}) => {
  const years = [
    ... new 
    Set([...tiendasParametros.agnosComparar])
  ].sort((a, b) => b - a);
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {
        (()=>{
          if(Array.isArray(semanalesTienda)){
            const Item = semanalesTienda.map((tienda, index) => {
              const comp = {
                columnTitle: 'COMPROMISO',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda['compromiso' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['ventasActuales' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['porcentaje' + year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['ventasActuales' + year])
                      }
                    ]
                  ))
                ].flat(2)
              }

              const operaciones = {
                columnTitle: 'OPERACIONES',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda['operacionesComp'+ getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['operacionesActual'+ getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['porcentajeOperaciones'+ year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['operacionesActual'+ year])
                      }
                    ]
                  ))
                ].flat(2)
              }

              const promedios = {
                columnTitle: 'PROMEDIOS',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda['promedioComp' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['promedioActual' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['porcentajePromedios' + year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['promedioActual' + year])
                      }
                    ]
                  ))
                ].flat(2)
              }

              const articulos = {
                columnTitle: 'ARTICULOS PROM',
                values:[
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['articulosActual' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['articulosPorcentaje' + year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['articulosActual' + year])
                      }
                    ]
                  ))
                ].flat(2)
              }

              return(
                <Stats
                  key={index}
                  title={tienda.plaza}
                  expand={true}
                  columns={[
                    comp,
                    operaciones,
                    promedios,
                    articulos
                  ]}
                />
              )
            });
            return Item;
          }
        })()
      }
    </div>
  )
}

const TableMobil = ({tiendasParametros, semanalesTienda}) => {
  const years = [
    ... new 
    Set([...tiendasParametros.agnosComparar])
  ].sort((a, b) => b - a);

  return(
    <section>
      {
        (()=>{
          if(Array.isArray(semanalesTienda)){
            const count = semanalesTienda.length - 1;
            return(
              <Fragment>

                <table className="mobile-table mb-8">
                    <caption className="text-blue-500 font-bold mb-1 uppercase">compromiso</caption>
                    <thead className="text-right text-xs">
                      <tr>
                        <th className="text-center">Plaza</th>
                        <th>COMP</th>
                        <th>{getYearFromDate(tiendasParametros.fechaFin)}</th>
                        {
                          years.map(year => (
                            <React.Fragment key={v4()}>
                              <th>%</th>
                              <th>{year}</th>
                            </ React.Fragment>
                          ))
                        }
                      </tr>
                    </thead>
                    <tbody className="text-[10px]">
                      {
                      semanalesTienda.map((tienda, index) => (
                          <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                            <td className="text-left">{tienda.plaza}</td>
                            <td className="text-right">{numberWithCommas(tienda['compromiso' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                            <td className="font-bold text-right" >{numberWithCommas(tienda['ventasActuales' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                            {
                              years.map(year => (
                                <React.Fragment key={v4()}>
                                  {tdFormatNumber(tienda['porcentaje' + year], count == index, 10)}
                                  <td className="text-right">{numberWithCommas(tienda['ventasActuales' + year])}</td>
                                </React.Fragment>
                              ))
                            }
                          </TableRow>
                        ))
                      }
                    </tbody>
                  </table>

                <table className="mobile-table mb-8">
                  <caption className="text-blue-500 font-bold mb-1 uppercase">Operaciones</caption>
                  <thead className="text-right text-xs">
                    <tr>
                      <th className="text-center">Plaza</th>
                      <th>COMP</th>
                      <th>{getYearFromDate(tiendasParametros.fechaFin)}</th>
                      {
                        years.map(year => (
                          <React.Fragment key={v4()}>
                            <th>%</th>
                            <th>{year}</th>
                          </ React.Fragment>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {  
                     semanalesTienda.map((tienda, index) => (
                        <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                          <td className="text-left">{tienda.plaza}</td>
                          <td className="text-right">{numberWithCommas(tienda['operacionesComp'+ getYearFromDate(tiendasParametros.fechaFin)])}</td>
                          <td className="font-bold text-right" >{numberWithCommas(tienda['operacionesActual'+ getYearFromDate(tiendasParametros.fechaFin)])}</td>
                          {
                            years.map(year => (
                              <React.Fragment key={v4()}>
                                {tdFormatNumber(tienda['porcentajeOperaciones'+ year], count == index, 10)}
                                <td className="text-right">{numberWithCommas(tienda['operacionesActual'+ year])}</td>
                              </React.Fragment>
                            ))
                          }
                        </TableRow>
                      ))
                    }
                  </tbody>
                </table>

                <table className="mobile-table mb-8">
                  <caption className="text-blue-500 font-bold mb-1 uppercase">Promedios</caption>
                  <thead className="text-right text-xs">
                    <tr>
                      <th className="text-center">Plaza</th>
                      <th>COMP</th>
                      <th>{getYearFromDate(tiendasParametros.fechaFin)}</th>
                      {
                        years.map(year => (
                          <React.Fragment key={v4()}>
                            <th>%</th>
                            <th>{year}</th>
                          </ React.Fragment>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {
                      semanalesTienda.map((tienda, index) => (
                        <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                          <td className="text-left">{tienda.plaza}</td>
                          <td className="text-right">{numberWithCommas(tienda['promedioComp' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                          <td className="font-bold text-right" >{numberWithCommas(tienda['promedioActual' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                          {
                            years.map(year => (
                              <React.Fragment key={v4()}>
                                {tdFormatNumber(tienda['porcentajePromedios' + year], count == index, 10)}
                                <td className="text-right">{numberWithCommas(tienda['promedioActual' + year])}</td>
                              </React.Fragment>
                            ))
                          }
                        </TableRow>
                      ))
                    }
                  </tbody>
                </table>

                <table className="mobile-table">
                  <caption className="text-blue-500 font-bold mb-1 uppercase">Articulos Prom.</caption>
                  <thead className="text-right text-xs">
                    <tr>
                      <th className="text-center">Plaza</th>
                      <th>{getYearFromDate(tiendasParametros.fechaFin)}</th>
                      {
                        years.map(year => (
                          <React.Fragment key={v4()}>
                            <th>%</th>
                            <th>{year}</th>
                          </ React.Fragment>
                        ))
                      }
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {
                      semanalesTienda.map((tienda, index) => (
                        <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                          <td className="text-left">{tienda.plaza}</td>
                          <td className="font-bold text-right" >{numberWithCommas(tienda['articulosActual' + getYearFromDate(tiendasParametros.fechaFin)])}</td>
                          {
                            years.map(year => (
                              <React.Fragment key={v4()}>
                                {tdFormatNumber(tienda['articulosPorcentaje' + year], count == index, 10)}
                                <td className="text-right">{numberWithCommas(tienda['articulosActual' + year])}</td>
                              </React.Fragment>
                            ))
                          }
                        </TableRow>
                      ))
                    }
                  </tbody>
                </table>

              </Fragment>
            )
          }
        })()
      }
    </section>
  )
}

const StatGroup = ({data, tiendasParametros, selectRegion}) => {
  const years = [
    ... new 
    Set([...tiendasParametros.agnosComparar])
  ].sort((a, b) => b - a);

  return(
    <div>
      {
        (()=>{
          if( data && Object.keys(data).length > 0 && data.hasOwnProperty(selectRegion)){


            const comp = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda['compromiso' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['ventasActuales' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['porcentaje' + year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['ventasActuales' + year])
                      }
                    ]
                  ))
                ].flat(2)
              }
            ));

            const operaciones = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda['operacionesComp'+ getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['operacionesActual'+ getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['porcentajeOperaciones'+ year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['operacionesActual'+ year])
                      }
                    ]
                  ))
                ].flat(2)
              }
            ));

            const promedios = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda['promedioComp' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['promedioActual' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['porcentajePromedios' + year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['promedioActual' + year])
                      }
                    ]
                  ))
                ].flat(2)
              }
            ));

            const articulos = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda['articulosActual' + getYearFromDate(tiendasParametros.fechaFin)])
                  },
                  years.map(year =>(
                    [
                      {
                        caption:'%',
                        value:stringFormatNumber(tienda['articulosPorcentaje' + year])
                      },
                      {
                        caption: year,
                        value:numberWithCommas(tienda['articulosActual' + year])
                      }
                    ]
                  ))
                ].flat(2)
              }
            ));

            return(
              <Fragment key={v4()}>
                <div className='grid grid-cols-1 xl:grid-cols-4 gap-4'>
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
                  <Stats
                    title='ARTICULOS PROM'
                    expand={false}
                    columns={(articulos && [...articulos])}
                  />
                </div>
              </Fragment>
            )
          }
        })()
      }
    </div>
  )
}

const renderRow = (item, isLast = false) => {
  if (plazas.findIndex((plaza) => plaza.text === item.plaza) !== -1) {
    return (
      <RegionesPlazaTableRow
        item={item}
        type="plaza"
        key={item.plaza}
        rowId={item.plaza}
        isLast = {isLast}
      />
    );
  }
  if (regiones.includes(item.plaza)) {
    return (
      <RegionesPlazaTableRow
        item={item}
        type="region"
        key={item.plaza}
        rowId={item.plaza}
        isLast = {isLast}
      />
    );
  }
  return (
    <RegionesPlazaTableRow item={item} key={item.plaza} rowId={item.plaza} isLast = {isLast}/>
  );
};

const TiendasWithAuth = withAuth(Tiendas);
TiendasWithAuth.getLayout = getVentasLayout;
export default TiendasWithAuth;
