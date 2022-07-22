import { Fragment, useEffect, useState } from "react";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  InputDateRange,
  SelectTiendasCombo,
  Checkbox,
  SelectCompromiso,
} from "../../components/inputs";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import { getSemanalesPlazas } from "../../services/SemanalesService";
import { checkboxLabels, MENSAJE_ERROR } from "../../utils/data";
import { inputNames } from "../../utils/data/checkboxLabels";
import {
  getCurrentWeekDateRange,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  dateRangeTitle,
  validateInputDateRange,
} from "../../utils/functions";
import { handleChange } from "../../utils/handlers";
import { formatNumber, numberWithCommas, stringFormatNumber, tdFormatNumber } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import Stats from "../../components/Stats";
import ViewFilter from "../../components/ViewFilter";
import { isMobile } from "react-device-detect";
import {spliceData} from '../../utils/functions';
import { v4 } from "uuid";
import semPlaza from "../../utils/excel/templates/semPlaza";
import exportExcel from "../../utils/excel/exportExcel";
import ExportExcel from "../../components/buttons/ExportExcel";

const Plazas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [semanalesPlaza, setSemanalesPlaza] = useState([]);
  const [displayType, setDisplayType] = useState(1);
  const [selectRegion, setRegion] = useState("");
  const [comparativoPlaza, setComparativoPlaza] = useState([]);
  const [plazasParametros, setPlazasParametros] = useState({
    fechaInicio: beginDate,
    fechaFin: endDate,
    conIva: 0,
    sinAgnoVenta: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 1,
  });

  useEffect(()=>{
    setPlazasParametros(prev => ({
      ...prev,
      conIva: config?.conIva || 0,
      sinAgnoVenta: config?.sinAgnoVenta || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
      resultadosPesos: config?.resultadosPesos || 0,
    }));
    setDisplayType((isMobile ? config?.mobileReportView : config?.desktopReportView));
  },[config])

  useEffect(() => {
    (async()=>{
      if(validateInputDateRange(plazasParametros.fechaInicio,plazasParametros.fechaFin)){
        try {
          const response = await getSemanalesPlazas(plazasParametros);
          setSemanalesPlaza(response);
          const replaced = spliceData(response, response.map(item => item.plaza));
          setComparativoPlaza(replaced);
          setRegion(response[0].plaza)
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazasParametros]);

  const handleExport = () => {
    const template = semPlaza(dateRangeTitle(plazasParametros.fechaInicio,plazasParametros.fechaFin));
    exportExcel('semanales plaza',template.columns, [...semanalesPlaza, ...semanalesPlaza],template.style)
  }

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Detalles de información / Semanales por plaza" />

      <section className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <ParametersContainer>
            <Parameters>

              <InputContainer>
                <InputDateRange
                  onChange={(e) => handleChange(e, setPlazasParametros)}
                  beginDate={plazasParametros.fechaInicio}
                  endDate={plazasParametros.fechaFin}
                />
                <SelectCompromiso
                  onChange={(e) => handleChange(e, setPlazasParametros)}
                  value={'compromiso'}
                />
                <SelectTiendasCombo
                  onChange={(e) => handleChange(e, setPlazasParametros)}
                  value={'todas'}
                />
              </InputContainer>
             
              <InputContainer>
                <Checkbox
                  labelText={checkboxLabels.VENTAS_IVA}
                  checked={plazasParametros.conIva ? 1 : 0}
                  name={inputNames.CON_IVA}
                  onChange={(e) => handleChange(e, setPlazasParametros)}
                />
                <Checkbox
                  labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                  checked={plazasParametros.conVentasEventos ? 1 : 0}
                  name={inputNames.CON_VENTAS_EVENTOS}
                  onChange={(e) => handleChange(e, setPlazasParametros)}
                />
                <Checkbox
                  labelText={checkboxLabels.RESULTADO_PESOS}
                  name={inputNames.RESULTADOS_PESOS}
                  checked={plazasParametros.resultadosPesos ? 1 : 0}
                  onChange={(e) => handleChange(e, setPlazasParametros)}
                />
              </InputContainer>
            </Parameters>
          </ParametersContainer>
          <ViewFilter 
            viewOption={displayType} 
            handleView={setDisplayType} 
            selectOption={selectRegion} 
            handleSelect = {setRegion}
            options={semanalesPlaza && semanalesPlaza.map(item => item.plaza)}
          />
        </div>
        <div className="flex justify-between">
          <p className='text-sm font-bold'>{selectRegion}</p>
          <ExportExcel handleClick={handleExport}/>
        </div>
      </section>

      <section className="p-4 overflow-y-auto ">
        {
          (()=>{
            switch(displayType){
              case 1:
                return <Table plazasParametros={plazasParametros} semanalesPlaza={semanalesPlaza}/>
              case 2:
                return <Stat plazasParametros={plazasParametros} semanalesPlaza={semanalesPlaza}/>
              case 3:
                return  <StatsGroup plazasParametros={plazasParametros} selectRegion={selectRegion} comparativoPlaza={comparativoPlaza} />
              case 4:
                return <TableMobil plazasParametros={plazasParametros} semanalesPlaza={semanalesPlaza}/>
              default:
                return <Table plazasParametros={plazasParametros} semanalesPlaza={semanalesPlaza}/>
            }
          })()
        }
      </section>
    </div>
  );
};

const Table = ({ plazasParametros,semanalesPlaza}) => {
  return(
    <VentasTableContainer>
      <VentasTable className="tfooter">
        <TableHead>
          <tr>
            <td
              rowSpan={3}
              className="border border-white bg-black-shape rounded-tl-xl"
            >
              Plaza
            </td>
            <td
              colSpan={12}
              className="border border-white bg-black-shape rounded-tr-xl"
            >
              {dateRangeTitle(
                plazasParametros.fechaInicio,
                plazasParametros.fechaFin
              )}
            </td>
          </tr>
          <tr>
            <td rowSpan={2} className="border border-white bg-black-shape text-right">
              Comp
            </td>
            <td rowSpan={2} className="border border-white bg-black-shape text-right">
              {getYearFromDate(plazasParametros.fechaFin)}
            </td>
            <td rowSpan={2} className="border border-white bg-black-shape text-right">
              %
            </td>
            <td rowSpan={2} className="border border-white bg-black-shape text-right">
              {getYearFromDate(plazasParametros.fechaFin) - 1}
            </td>
            <td colSpan={4} className="border border-white bg-black-shape text-right">
              operaciones
            </td>
            <td colSpan={4} className="border border-white bg-black-shape text-right">
              promedios
            </td>
          </tr>
          <tr>
            <td className="border border-white bg-black-shape text-right">Comp</td>
            <td className="border border-white bg-black-shape text-right">
              {getYearFromDate(plazasParametros.fechaFin)}
            </td>
            <td className="border border-white bg-black-shape text-right">%</td>
            <td className="border border-white bg-black-shape text-right">
              {getYearFromDate(plazasParametros.fechaFin) - 1}
            </td>
            <td className="border border-white bg-black-shape text-right">comp</td>
            <td className="border border-white bg-black-shape text-right">
              {getYearFromDate(plazasParametros.fechaFin)}
            </td>
            <td className="border border-white bg-black-shape text-right">%</td>
            <td className="border border-white bg-black-shape text-right">
              {getYearFromDate(plazasParametros.fechaFin) - 1}
            </td>
          </tr>
        </TableHead>
        <tbody className="bg-white text-right text-xs">
          {
            (()=>{
              if(semanalesPlaza.length > 0){
                const count = semanalesPlaza.length - 1;
                const Items = semanalesPlaza?.map((semPlaza, index) => (
                  <TableRow key={semPlaza.plaza} rowId={semPlaza.plaza}>
                    <td className="text-left  text-black font-bold ">
                      {semPlaza.plaza}
                    </td>
                    <td>{numberWithCommas(semPlaza.compromiso)}</td>
                    <td className="font-bold">
                      {numberWithCommas(semPlaza.ventasActuales)}
                    </td>
                    {formatNumber(semPlaza.porcentaje, index == count)}
                    <td>{numberWithCommas(semPlaza.ventasAnterior)}</td>
                    <td className="font-bold">
                      {numberWithCommas(semPlaza.operacionesComp)}
                    </td>
                    <td className="font-bold">
                      {numberWithCommas(semPlaza.operacionesActual)}
                    </td>
                    {formatNumber(semPlaza.porcentajeOperaciones, index == count)}
                    <td>{numberWithCommas(semPlaza.operacionesAnterior)}</td>
                    <td className="font-bold">
                      {numberWithCommas(semPlaza.promedioComp)}
                    </td>
                    <td className="font-bold">
                      {numberWithCommas(semPlaza.promedioActual)}
                    </td>
                    {formatNumber(semPlaza.porcentajePromedios, index == count)}
                    <td>{numberWithCommas(semPlaza.promedioAnterior)}</td>
                  </TableRow>
                ))
                return Items
              }
            })()
          }
        </tbody>
      </VentasTable>
    </VentasTableContainer>
  )
}

const Stat = ({ plazasParametros,semanalesPlaza}) => {
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {
       (()=>{
          if(Array.isArray(semanalesPlaza)){
            const Item = semanalesPlaza.map((plaza, index) => {
              const comp = {
                columnTitle: 'COMPROMISO',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(plaza.compromiso)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin),
                    value:numberWithCommas(plaza.ventasActuales)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(plaza.porcentaje, false)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin) - 1,
                    value:numberWithCommas(plaza.ventasAnterior)
                  }
                ]
              }

              const operaciones = {
                columnTitle: 'OPERACIONES',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(plaza.operacionesComp)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin),
                    value:numberWithCommas(plaza.operacionesActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(plaza.porcentajeOperaciones, false)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin) - 1,
                    value:numberWithCommas(plaza.operacionesAnterior)
                  }
                ]
              }

              const promedios = {
                columnTitle: 'PROMEDIOS',
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(plaza.promedioComp)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin),
                    value:numberWithCommas(plaza.promedioActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(plaza.porcentajePromedios, false)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin) - 1,
                    value:numberWithCommas(plaza.promedioAnterior)
                  }
                ]
              }

              return(
                <Stats
                  key={index}
                  title={plaza.plaza}
                  columns={[
                    comp,
                    operaciones,
                    promedios
                  ]}
                />
              )
            });
            return Item
          }
       })()
      }
    </div>
  )
}

const TableMobil = ({plazasParametros,semanalesPlaza}) => {
  return(
    <section>
      {
        (()=>{
          if(Array.isArray(semanalesPlaza)){
            const count = semanalesPlaza.length - 1;
            return(
              <Fragment>
                <table className="mobile-table mb-8">
                  <caption className="text-blue-500 font-bold mb-1 uppercase">compromiso</caption>
                  <thead className="text-right text-xs">
                    <tr>
                      <th className="text-center">Plaza</th>
                      <th>COMP</th>
                      <th>{getYearFromDate(plazasParametros.fechaFin)}</th>
                      <th>%</th>
                      <th>{getYearFromDate(plazasParametros.fechaFin) - 1}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {
                     semanalesPlaza.map((plaza, index) => (
                        <TableRow key={plaza.plaza} rowId={plaza.plaza}>
                          <td className="text-left">{plaza.plaza}</td>
                          <td className="text-right">{numberWithCommas(plaza.compromiso)}</td>
                          <td className="font-bold text-right" >{numberWithCommas(plaza.ventasActuales)}</td>
                          {tdFormatNumber(plaza.porcentaje, count == index, 10)}
                          <td className="text-right">{numberWithCommas(plaza.ventasAnterior)}</td>
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
                      <th>{getYearFromDate(plazasParametros.fechaFin)}</th>
                      <th>%</th>
                      <th>{getYearFromDate(plazasParametros.fechaFin) - 1}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {  
                     semanalesPlaza.map((plaza, index) => (
                        <TableRow key={plaza.plaza} rowId={plaza.plaza}>
                          <td className="text-left">{plaza.plaza}</td>
                          <td className="text-right">{numberWithCommas(plaza.operacionesComp)}</td>
                          <td className="font-bold text-right" >{numberWithCommas(plaza.operacionesActual)}</td>
                          {tdFormatNumber(plaza.porcentajeOperaciones, count == index, 10)}
                          <td className="text-right">{numberWithCommas(plaza.operacionesAnterior)}</td>
                        </TableRow>
                      ))
                    }
                  </tbody>
                </table>

                <table className="mobile-table">
                  <caption className="text-blue-500 font-bold mb-1 uppercase">Promedios</caption>
                  <thead className="text-right text-xs">
                    <tr>
                      <th className="text-center">Plaza</th>
                      <th>COMP</th>
                      <th>{getYearFromDate(plazasParametros.fechaFin)}</th>
                      <th>%</th>
                      <th>{getYearFromDate(plazasParametros.fechaFin) - 1}</th>
                    </tr>
                  </thead>
                  <tbody className="text-[10px]">
                    {
                     semanalesPlaza.map((plaza, index) => (
                        <TableRow key={plaza.plaza} rowId={plaza.plaza}>
                          <td className="text-left">{plaza.plaza}</td>
                          <td className="text-right">{numberWithCommas(plaza.promedioComp)}</td>
                          <td className="font-bold text-right" >{numberWithCommas(plaza.promedioActual)}</td>
                          {tdFormatNumber(plaza.porcentajePromedios, count == index, 10)}
                          <td className="text-right">{numberWithCommas(plaza.promedioAnterior)}</td>
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

const StatsGroup = ({plazasParametros, selectRegion, comparativoPlaza}) => {
  return(
    <div>
      {
        (()=>{
          if(Object.keys(comparativoPlaza).length > 0 && comparativoPlaza.hasOwnProperty(selectRegion)){
            const compromiso = comparativoPlaza[selectRegion].map(plaza => (
              {
                columnTitle: plaza.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(plaza.compromiso)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin),
                    value:numberWithCommas(plaza.ventasActuales)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(plaza.porcentaje)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin) - 1,
                    value:numberWithCommas(plaza.ventasAnterior)
                  }
                ]
              }
            ));

            const operaciones = comparativoPlaza[selectRegion].map(plaza => (
              {
                columnTitle: plaza.plaza,
                values:[
                  {
                    caption: 'COMP',
                    value:numberWithCommas(plaza.operacionesComp)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin),
                    value:numberWithCommas(plaza.operacionesActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(plaza.porcentajeOperaciones)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin) - 1,
                    value:numberWithCommas(plaza.operacionesAnterior)
                  }
                ]
              }
            ));

            const promedios = comparativoPlaza[selectRegion].map(plaza => (
              {
                columnTitle: plaza.plaza,
                values:[
                  {
                    caption:'COMP',
                    value:numberWithCommas(plaza.promedioComp)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin),
                    value:numberWithCommas(plaza.promedioActual)
                  },
                  {
                    caption:'%',
                    value:stringFormatNumber(plaza.porcentajePromedios)
                  },
                  {
                    caption:getYearFromDate(plazasParametros.fechaFin) - 1,
                    value:numberWithCommas(plaza.promedioAnterior)
                  }
                ]
              }
            ));

            return(
              <Fragment key={v4()}>
                <div className={`grid grid-cols-1 xl:grid-cols-3 gap-4`}>
                 <Stats
                      title= {'COMPROMISO'}
                      columns={(compromiso && [...compromiso])}
                      expand={false}
                    />
                    <Stats
                      title= {'OPERACIONES'}
                      columns={(operaciones && [...operaciones])}
                      expand={false}
                    />
                      <Stats
                      title= {'PROMEDIOS'}
                      columns={(promedios && [...promedios])}
                      expand={false}
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

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
