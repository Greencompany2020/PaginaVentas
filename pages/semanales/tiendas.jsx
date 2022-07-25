import { useState, useEffect, Fragment } from "react";
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
import { numberWithCommas, stringFormatNumber, tdFormatNumber} from "../../utils/resultsFormated";
import { isMobile } from "react-device-detect";
import ViewFilter from "../../components/ViewFilter";
import { v4 } from "uuid";

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
      agnosComparar: spliteArrDate(config.agnosComparativos),
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
          console.log(response);
          setSemanalesTienda(response);
          switch(tiendasParametros.tiendas){
            case 0:
              seccionesTemp = ['REGION I', 'REGION II', 'REGION III', 'GRUPO'];
              break;
            case 2:
              seccionesTemp = ['SK-MAZATLAN', 'SK CULIACAN', 'SK MEXICALI', 'SK CHIHUAHUA', 'SK TIJUANA', 'SIN REGION', 'GRUPO'];
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
  }, [tiendasParametros]);

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

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Detalles de información / Semanales por Tienda" />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <div className="flex flex-col justify-between h-full">
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
                  value={'awanta - 2'}
                  onChange={(e) => handleChange(e, setTiendasParametros)}
                />
                <SelectTiendasCombo
                  value={'awanta'}
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
          <p className={`text-sm font-bold ${displayType != 3 && 'hidden'}`}>{ getRegionName()}</p>
        </div>
        <ViewFilter 
          viewOption={displayType} 
          handleView={setDisplayType} 
          selectOption={selectRegion} 
          handleSelect = {setRegion}
          options={seccion}
        />
      </section>

      <section className="p-4 overflow-y-auto ">
        <Table tiendasParametros={tiendasParametros} semanalesTienda={semanalesTienda}/>
        {/*
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
        */}
      </section>
    </div>
  );
};

const Table = ({tiendasParametros, semanalesTienda}) => {
  const compareYears = [
    ... new 
    Set([...tiendasParametros.agnosComparar, getYearFromDate(tiendasParametros.fechaFin)])
  ].sort((a, b) => a + b);

  return(
    <VentasTableContainer>
      <VentasTable className="tfooter">
        <TableHead>
          <tr>
            <td rowSpan={3} className="border border-white bg-black-shape rounded-tl-xl">Plaza</td>
            <td colSpan={15} className="border border-white bg-black-shape rounded-tr-xl">
              {dateRangeTitle(
                tiendasParametros.fechaInicio,
                tiendasParametros.fechaFin
              )}
            </td>
          </tr>
        </TableHead>
      </VentasTable>
    </VentasTableContainer>
  )
}

const Stat = ({tiendasParametros, semanalesTienda}) => {
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
                    value:numberWithCommas(tienda.compromiso)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.ventasActuales)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentaje, false)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.ventasAnterior)
                  }
                ]
              }

              const operaciones = {
                columnTitle: 'OPERACIONES',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda.operacionesComp)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.operacionesActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentajeOperaciones, false)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.operacionesAnterior)
                  }
                ]
              }

              const promedios = {
                columnTitle: 'PROMEDIOS',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda.promedioComp)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.promedioActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentajePromedios, false)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.promedioAnterior)
                  }
                ]
              }

              const articulos = {
                columnTitle: 'ARTICULOS PROM',
                values:[
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.articulosActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.articulosPorcentaje, false)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.articulosAnterior)
                  }
                ]
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
                        <th>%</th>
                        <th>{getYearFromDate(tiendasParametros.fechaFin) - 1}</th>
                      </tr>
                    </thead>
                    <tbody className="text-[10px]">
                      {
                      semanalesTienda.map((tienda, index) => (
                          <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                            <td className="text-left">{tienda.plaza}</td>
                            <td className="text-right">{numberWithCommas(tienda.compromiso)}</td>
                            <td className="font-bold text-right" >{numberWithCommas(tienda.ventasActuales)}</td>
                            {tdFormatNumber(tienda.porcentaje, count == index, 10)}
                            <td className="text-right">{numberWithCommas(tienda.ventasAnterior)}</td>
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
                      <th>%</th>
                      <th>{getYearFromDate(tiendasParametros.fechaFin) - 1}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {  
                     semanalesTienda.map((tienda, index) => (
                        <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                          <td className="text-left">{tienda.plaza}</td>
                          <td className="text-right">{numberWithCommas(tienda.operacionesComp)}</td>
                          <td className="font-bold text-right" >{numberWithCommas(tienda.operacionesActual)}</td>
                          {tdFormatNumber(tienda.porcentajeOperaciones, count == index, 10)}
                          <td className="text-right">{numberWithCommas(tienda.operacionesAnterior)}</td>
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
                      <th>%</th>
                      <th>{getYearFromDate(tiendasParametros.fechaFin) - 1}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {
                      semanalesTienda.map((tienda, index) => (
                        <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                          <td className="text-left">{tienda.plaza}</td>
                          <td className="text-right">{numberWithCommas(tienda.promedioComp)}</td>
                          <td className="font-bold text-right" >{numberWithCommas(tienda.promedioActual)}</td>
                          {tdFormatNumber(tienda.porcentajePromedios, count == index, 10)}
                          <td className="text-right">{numberWithCommas(tienda.promedioAnterior)}</td>
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
                      <th>%</th>
                      <th>{getYearFromDate(tiendasParametros.fechaFin) - 1}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {
                      semanalesTienda.map((tienda, index) => (
                        <TableRow key={tienda.plaza} rowId={tienda.plaza} className={rowRegion(tienda.plaza)}>
                          <td className="text-left">{tienda.plaza}</td>
                          <td className="font-bold text-right" >{numberWithCommas(tienda.articulosActual)}</td>
                          {tdFormatNumber(tienda.articulosPorcentaje, count == index, 10)}
                          <td className="text-right">{numberWithCommas(tienda.articulosAnterior)}</td>
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
  return(
    <div>
      {
        (()=>{
          if(Object.keys(data).length > 0 && data.hasOwnProperty(selectRegion)){


            const comp = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda.compromiso)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.ventasActuales)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentaje)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.ventasAnterior)
                  }
                ]
              }
            ));

            const operaciones = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda.operacionesComp)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.operacionesActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentajeOperaciones)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.operacionesAnterior)
                  }
                ]
              }
            ));

            const promedios = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(tienda.promedioComp)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.promedioActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.porcentajePromedios)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.promedioAnterior)
                  }
                ]
              }
            ));

            const articulos = data[selectRegion].map(tienda => (
              {
                columnTitle:tienda.plaza,
                values:[
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin),
                    value:numberWithCommas(tienda.articulosActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(tienda.articulosPorcentaje)
                  },
                  {
                    caption:getYearFromDate(tiendasParametros.fechaFin) - 1,
                    value:numberWithCommas(tienda.articulosAnterior)
                  }
                ]
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
