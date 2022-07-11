import { useState, useEffect, Fragment } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import { InputContainer, Checkbox, InputDate } from "../../components/inputs";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  getMonthByNumber,
  getPrevDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getTableName,  validateDate, getValueFromObject, spliceDataObject } from "../../utils/functions";
import { getComparativoPlazas } from "../../services/ComparativoService";
import { formatNumber, numberWithCommas, stringFormatNumber, tdFormatNumber } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import ViewFilter from "../../components/ViewFilter";
import Stats from "../../components/Stats";
import { v4 } from "uuid";
import { isMobile } from "react-device-detect";

const Plazas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [displayType, setDisplayType] = useState(1);
  const [selectRegion, setRegion] = useState("REGION I");
  const [comparativoRegion, setComparativoRegion] = useState({})
  const [comparativoPlazas, setComparativoPlazas] = useState({});
  const [semanaSanta, setSemanaSanta] = useState(true);
  const [regiones, setRegiones] = useState();
  const [parametrosPlazas, setParametrosPlazas] = useState({
    fecha: getPrevDate(1),
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 1,
    tipoCambioTiendas: 0,
  });

  useEffect(()=>{
    setParametrosPlazas(prev => ({
      ...prev,
      conIva: config?.conIva || 0,
      porcentajeVentasCompromiso: config?.porcentajeVentasCompromiso || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
      resultadosPesos: config?.resultadosPesos || 0,
      tipoCambioTiendas: config?.tipoCambioTiendas || 0,
    }));

    setSemanaSanta(config?.semanaSanta ? true : false);
    setDisplayType((isMobile ? config?.mobileReportView : config?.desktopReportView));
  },[config])

  useEffect(() => {
    (async()=>{
      if(validateDate(parametrosPlazas.fecha)){
        try {
          const response = await getComparativoPlazas(parametrosPlazas);
          setComparativoPlazas(response);
          const plazas = getValueFromObject(response,'plaza');
          const formated = spliceDataObject(response, plazas, 'GRUPO');
          setRegiones(plazas);
          setRegion(plazas[0]);
          setComparativoRegion(formated);

        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR,
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosPlazas]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`COMPARATIVO VENTAS DEL AÑO 
          ${parametrosPlazas.fecha.split("-")[0]} (AL ${
          parametrosPlazas.fecha.split("-")[2]
        } DE ${getMonthByNumber(
          parametrosPlazas.fecha.split("-")[1]
        ).toUpperCase()})`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <div className="flex flex-col justify-between h-full">
          <ParametersContainer>
            <Parameters>
              <InputContainer>
                <InputDate
                  value={parametrosPlazas.fecha}
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.VENTAS_IVA}
                  checked={parametrosPlazas.conIva ? true : false}
                  name={inputNames.CON_IVA}
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.VENTAS_VS_COMPROMISO}
                  name={inputNames.PORCENTAJE_COMPROMISO}
                  checked={
                    parametrosPlazas.porcentajeVentasCompromiso ? true : false
                  }
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.SEMANA_SANTA}
                  name={inputNames.SEMANA_SANTA}
                  checked={semanaSanta}
                  onChange={() => setSemanaSanta((prev) => !prev)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                  checked={parametrosPlazas.conVentasEventos ? true : false}
                  name={inputNames.CON_VENTAS_EVENTOS}
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                  checked={parametrosPlazas.conTiendasCerradas ? true : false}
                  name={inputNames.CON_TIENDAS_CERRADAS}
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                  name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                  checked={parametrosPlazas.sinTiendasSuspendidas ? true : false}
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.RESULTADO_PESOS}
                  name={inputNames.RESULTADOS_PESOS}
                  checked={parametrosPlazas.resultadosPesos ? true : false}
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
                <Checkbox
                  className="mb-3"
                  labelText={checkboxLabels.TIPO_CAMBIO_TIENDAS}
                  checked={parametrosPlazas.tipoCambioTiendas ? true : false}
                  name={inputNames.TIPO_CAMBIO_TIENDAS}
                  onChange={(e) => handleChange(e, setParametrosPlazas)}
                />
              </InputContainer>
            </Parameters>
          </ParametersContainer>
          <p className={`text-sm font-bold ${displayType != 3 && 'hidden'}`}>{selectRegion}</p>
        </div>
        <ViewFilter 
          viewOption={displayType} 
          handleView={setDisplayType} 
          selectOption={selectRegion} 
          handleSelect = {setRegion}
          options={regiones}
        />
      </section>

      <section className="p-4 overflow-y-auto ">
        {
          (()=>{
            switch(displayType){
              case 1:
                return <Table comparativoPlazas={comparativoPlazas} parametrosPlazas={parametrosPlazas}/>
              case 2: 
                return <Stat comparativoPlazas={comparativoPlazas} parametrosPlazas={parametrosPlazas}/>
              case 3:
                 return <StatGroup parametrosPlazas={parametrosPlazas} comparativoRegion={comparativoRegion} selectRegion={selectRegion}/>
              case 4: 
                return <TableMobil comparativoPlazas={comparativoPlazas} parametrosPlazas={parametrosPlazas}/>
              default:
                return <Table comparativoPlazas={comparativoPlazas} parametrosPlazas={parametrosPlazas}/>
            }
          })()
        }
      </section>
    </div>
  );
};

const Stat = ({parametrosPlazas, comparativoPlazas}) => {
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {
        Object.entries(comparativoPlazas)?.map(([key, value]) => (
          (()=>{
            if(value){
              const Item = value.map((plaza, index) => {
                const acumMes = {
                  columnTitle : 'Acumulado' +' '+ getMonthByNumber(parametrosPlazas.fecha.split("-")[1]),
                  values:[
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha),
                      value:numberWithCommas(plaza.ventasMensualesActual)
                    },
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha) - 1,
                      value:numberWithCommas(plaza.ventasMensualesAnterior)
                    },
                    {
                      caption:'PPTO',
                      value:numberWithCommas(plaza.presupuestoMensual)
                    },
                    {
                      caption:'(-)',
                      value:stringFormatNumber(plaza.diferenciaMensual, false)
                    },
                    {
                      caption:'%',
                      value:stringFormatNumber(plaza.porcentajeMensual, false)
                    }
                  ]
                }

                const acumAnual = {
                  columnTitle : 'Acumulado Anual' ,
                  values:[
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha),
                      value:numberWithCommas(plaza.ventasAnualActual)
                    },
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha) - 1,
                      value:numberWithCommas(plaza.ventasAnualAnterior)
                    },
                    {
                      caption:'PPTO',
                      value:numberWithCommas(plaza.presupuestoAnual)
                    },
                    {
                      caption:'(-)',
                      value:stringFormatNumber(plaza.diferenciaAnual, false)
                    },
                    {
                      caption:'%',
                      value:stringFormatNumber(plaza.porcentajeAnual, false)
                    }
                  ]
                }

                return(
                  <Stats
                  key={index}
                  title={plaza.plaza}
                  columns={[
                    acumMes,
                    acumAnual
                  ]}
                  />
                )

              })

              return Item
            }
          })()
        ))
      }
    </div>
  )
}

const TableMobil = ({parametrosPlazas, comparativoPlazas}) => {
  return(
    <section>
      {Object?.entries(comparativoPlazas ?? {})?.map(([key, value]) => (
        <Fragment key={key}>
          {getTableName(key)}

          <table className="mobile-table mb-8">
            <caption className="text-blue-500 font-bold mb-1 uppercase"> Acumulado{" "}{getMonthByNumber(parametrosPlazas.fecha.split("-")[1])}</caption>
            <thead className="text-right text-xs">
              <tr>
                <th className="text-center">Tienda</th>
                <th className="bg-gray-100"> {getYearFromDate(parametrosPlazas.fecha)}</th>
                <th>{getYearFromDate(parametrosPlazas.fecha)-1}</th>
                <th>PPTO</th>
                <th>(-)</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {
                (()=>{
                  if(value){
                    const count = value.length - 1;
                    const Items = value?.map((plaza, index) => (
                      <TableRow
                        key={plaza.tienda}
                        rowId={plaza.tienda}
                        
                      >
                        <td className="text-left">{plaza.plaza}</td>
                        <td className="font-bold text-right" >{numberWithCommas(plaza.ventasMensualesActual)}</td>
                        <td className="text-right">{numberWithCommas(plaza.ventasMensualesAnterior)}</td>
                        <td className="text-right">{numberWithCommas(plaza.presupuestoMensual)}</td>
                        {tdFormatNumber(plaza.diferenciaMensual, count == index, 10)}
                        {tdFormatNumber(plaza.porcentajeMensual, count == index, 10)}
                      </TableRow>
                    ));
                    return Items;
                  }
                })()
              }
            </tbody>
          </table>
          
          <table className="mobile-table mb-8">
            <caption className="text-blue-500 font-bold mb-1 uppercase"> Acumulado anual</caption>
            <thead className="text-right text-xs">
              <tr>
                <th className="text-center">Tienda</th>
                <th className="bg-gray-100"> {getYearFromDate(parametrosPlazas.fecha)}</th>
                <th>{getYearFromDate(parametrosPlazas.fecha)-1}</th>
                <th>PPTO</th>
                <th>(-)</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody className="text-[10px]">
              {
                (()=>{
                  if(value){
                    const count = value.length - 1;
                    const Items = value?.map((plaza, index) => (
                      <TableRow
                        key={plaza.tienda}
                        rowId={plaza.tienda}
                      >
                        <td className="text-left">{plaza.plaza}</td>
                        <td className="font-bold text-right" >{numberWithCommas(plaza.ventasAnualActual)}</td>
                        <td className="text-right">{numberWithCommas(plaza.ventasAnualAnterior)}</td>
                        <td className="text-right">{numberWithCommas(plaza.presupuestoAnual)}</td>
                        {tdFormatNumber(plaza.diferenciaAnual, count == index, 10)}
                        {tdFormatNumber(plaza.porcentajeAnual, count == index, 10)}
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

const Table = ({parametrosPlazas, comparativoPlazas}) => {
  return(
    <VentasTableContainer>
    {Object.entries(comparativoPlazas)?.map(([key, value]) => (
      <Fragment key={key}>
        {getTableName(key)}
        <VentasTable className=" tfooter">
          <TableHead>
            <tr>
              <th rowSpan={2} className="bg-black-shape rounded-tl-xl">
                Plaza
              </th>
              <th colSpan={5} className="bg-black-shape">
                Acumulado{" "}
                {getMonthByNumber(parametrosPlazas.fecha.split("-")[1])}
              </th>
              <th colSpan={5} className="bg-black-shape rounded-tr-xl">
                Acumulado Anual
              </th>
            </tr>
            <tr>
              <th className="bg-black-shape">
                {getYearFromDate(parametrosPlazas.fecha)}
              </th>
              <th className="bg-black-shape">
                {Number(getYearFromDate(parametrosPlazas.fecha)) - 1}
              </th>
              <th className="bg-black-shape">PPTO.</th>
              <th className="bg-black-shape">(-)</th>
              <th className="bg-black-shape">%</th>
              <th className="bg-black-shape">
                {getYearFromDate(parametrosPlazas.fecha)}
              </th>
              <th className="bg-black-shape">
                {Number(getYearFromDate(parametrosPlazas.fecha)) - 1}
              </th>
              <th className="bg-black-shape">PPTO.</th>
              <th className="bg-black-shape">(-)</th>
              <th className="bg-black-shape">%</th>
            </tr>
          </TableHead>
          <tbody className="text-center">
            {
              (()=>{
                if(value){
                  const count = value.length - 1;
                  const Items = value.map((plaza, index) => (
                    <TableRow
                      key={plaza.plaza}
                      rowId={plaza.plaza}
                      className="bg-white text-black text-xs text-right"
                    >
                      <td className="font-bold text-left">{plaza.plaza}</td>
                      <td className="font-bold">
                        {numberWithCommas(plaza.ventasMensualesActual)}
                      </td>
                      <td>{numberWithCommas(plaza.ventasMensualesAnterior)}</td>
                      <td>{numberWithCommas(plaza.presupuestoMensual)}</td>
                      {formatNumber(plaza.diferenciaMensual, count == index)}
                      {formatNumber(plaza.porcentajeMensual, count == index)}
                      <td className="font-bold">
                        {numberWithCommas(plaza.ventasAnualActual)}
                      </td>
                      <td>{numberWithCommas(plaza.ventasAnualAnterior)}</td>
                      <td>{numberWithCommas(plaza.presupuestoAnual)}</td>
                      {formatNumber(plaza.diferenciaAnual, count == index)}
                      {formatNumber(plaza.porcentajeAnual, count == index)}
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

const StatGroup = ({parametrosPlazas,comparativoRegion, selectRegion}) => {
  return(
    <div>
      {
        (()=>{
          if(Object.keys(comparativoRegion).length > 0 && comparativoRegion.hasOwnProperty(selectRegion)){
            let acumulado = [];
            let acumuladoAnual = [];
            if(selectRegion !== 'GRUPO'){
              acumulado = comparativoRegion[selectRegion].map(plaza => (
                {
                  columnTitle: plaza.plaza,
                  values:[
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha),
                      value:numberWithCommas(plaza.ventasMensualesActual)
                    },
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha) - 1,
                      value:numberWithCommas(plaza.ventasMensualesAnterior)
                    },
                    {
                      caption: 'PPTO',
                      value:numberWithCommas(plaza.presupuestoMensual)
                    },
                    {
                      caption:'(-)',
                      value:stringFormatNumber(plaza.diferenciaMensual)
                    },
                    {
                      caption:'%',
                      value:stringFormatNumber(plaza.porcentajeMensual)
                    }
                  ]
                }
              ));
              acumuladoAnual = comparativoRegion[selectRegion].map(plaza => (
                {
                  columnTitle: plaza.plaza,
                  values:[
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha),
                      value:numberWithCommas(plaza.ventasAnualActual)
                    },
                    {
                      caption:getYearFromDate(parametrosPlazas.fecha) - 1,
                      value:numberWithCommas(plaza.ventasAnualAnterior)
                    },
                    {
                      caption: 'PPTO',
                      value:numberWithCommas(plaza.presupuestoAnual)
                    },
                    {
                      caption:'(-)',
                      value:stringFormatNumber(plaza.diferenciaAnual)
                    },
                    {
                      caption:'%',
                      value:stringFormatNumber(plaza.porcentajeAnual)
                    }
                  ]
                }
              ));
              return(
                <Fragment key={v4()}>
                  <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                      <Stats
                        title= {'Acumulado' +' '+ getMonthByNumber(parametrosPlazas.fecha.split("-")[1])}
                        expand={false}
                        columns={acumulado && acumulado}
                      />
                      <Stats
                        title= {'Acumulado Anual'}
                        expand={false}
                        columns={acumuladoAnual && acumuladoAnual}
                      />
                  </div>
                </Fragment>
              )
            }
            else{
              return Object.entries(comparativoRegion.GRUPO ?? {})?.map(([key, value])=>(
                (()=> {  
                  acumulado = [
                    {
                      columnTitle: value.plaza,
                      values:[
                        {
                          caption:getYearFromDate(parametrosPlazas.fecha),
                          value:numberWithCommas(value.ventasMensualesActual)
                        },
                        {
                          caption:getYearFromDate(parametrosPlazas.fecha) - 1,
                          value:numberWithCommas(value.ventasMensualesAnterior)
                        },
                        {
                          caption: 'PPTO',
                          value:numberWithCommas(value.presupuestoMensual)
                        },
                        {
                          caption:'(-)',
                          value:stringFormatNumber(value.diferenciaMensual)
                        },
                        {
                          caption:'%',
                          value:stringFormatNumber(value.porcentajeMensual)
                        }
                      ]
                    }
                  ]
                  acumuladoAnual = [
                    {
                      columnTitle: value.plaza,
                      values:[
                        {
                          caption:getYearFromDate(parametrosPlazas.fecha),
                          value:numberWithCommas(value.ventasAnualActual)
                        },
                        {
                          caption:getYearFromDate(parametrosPlazas.fecha) - 1,
                          value:numberWithCommas(value.ventasAnualAnterior)
                        },
                        {
                          caption: 'PPTO',
                          value:numberWithCommas(value.presupuestoAnual)
                        },
                        {
                          caption:'(-)',
                          value:stringFormatNumber(value.diferenciaAnual)
                        },
                        {
                          caption:'%',
                          value:stringFormatNumber(value.porcentajeAnual)
                        }
                      ]
                    }
                  ]

                  return(
                    <Fragment key={v4()}>
                      <div className="mb-8">
                        {getTableName(key)}
                        <div className='grid grid-cols-1 xl:grid-cols-2 gap-4'>
                            <Stats
                              title= {'Acumulado' +' '+ getMonthByNumber(parametrosPlazas.fecha.split("-")[1])}
                              expand={false}
                              columns={acumulado && acumulado}
                            />
                            <Stats
                              title= {'Acumulado Anual'}
                              expand={false}
                              columns={acumuladoAnual && acumuladoAnual}
                            />
                        </div>
                      </div>
                    </Fragment>
                  )
                })()
              ))
            }
          }
        })()
      }
    </div>
  )
}

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
