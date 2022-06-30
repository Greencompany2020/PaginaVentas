import { useState, useEffect, useCallback } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  Checkbox,
  SelectTiendasGeneral,
  InputDate,
} from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableBody,
  TableHead,
  TableRow,
} from "../../components/table";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  getMonthByNumber,
  getPrevDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import {
  getLastTwoNumbers,
  validateDate,
} from "../../utils/functions";
import { getPorcentajeCrecimiento } from "../../services/PorcentajesService";
import { numberWithCommas } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Crecimiento = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [dateRange, setDateRange] = useState([]);
  const [crecimiento, setCrecimiento] = useState([]);
  const [paramCrecimiento, setParamCrecimiento] = useState({
    fecha: getPrevDate(1),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 0,
  });

  const createDateRange = useCallback(() => {
    const dateRange = [];
    const year = Number(getYearFromDate(paramCrecimiento.fecha));
    for (let i = year; i >= year - 5; i--) {
      dateRange.push(i);
    }
    setDateRange(dateRange);
  }, [paramCrecimiento.fecha]);

  useEffect(()=>{
    setParamCrecimiento(prev => ({
      ...prev,
      conIva: config?.conIva || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      sinTiendasSuspendidas: config?.sinTiendasSuspendidas|| 0,
      resultadosPesos: config?.resultadosPesos || 0,
    }))
  },[config])

  useEffect(() => {
    (async()=>{
      if(validateDate(paramCrecimiento.fecha)){
        try{
          const response = await getPorcentajeCrecimiento(paramCrecimiento);
          createDateRange();
          setCrecimiento(response);
        }catch(error){
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramCrecimiento, createDateRange]);

  const createTableHeadForYears = () => {
    return dateRange.map((year) => (
      <th key={year}>{getLastTwoNumbers(year)}</th>
    ));
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Factor de crecimiento al 
          ${paramCrecimiento.fecha.split("-")[2]} de 
          ${getMonthByNumber(paramCrecimiento.fecha.split("-")[1])} de 
          ${getYearFromDate(paramCrecimiento.fecha)} Acumulado y Anual`}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputDate
                value={paramCrecimiento.fecha}
                onChange={(e) => handleChange(e, setParamCrecimiento)}
              />
              <SelectTiendasGeneral
                value={paramCrecimiento.tiendas}
                onChange={(e) => handleChange(e, setParamCrecimiento)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={paramCrecimiento.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setParamCrecimiento)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={paramCrecimiento.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setParamCrecimiento)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={paramCrecimiento.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setParamCrecimiento)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                checked={paramCrecimiento.sinTiendasSuspendidas ? true : false}
                onChange={(e) => handleChange(e, setParamCrecimiento)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                checked={paramCrecimiento.resultadosPesos ? true : false}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setParamCrecimiento)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer
          title={`Factor de crecimiento al 
          ${paramCrecimiento.fecha.split("-")[2]} de 
          ${getMonthByNumber(paramCrecimiento.fecha.split("-")[1])} de 
          ${getYearFromDate(paramCrecimiento.fecha)} Acumulado y Anual`}
        >
          <VentasTable className="tfooter">
            <TableHead>
              <tr>
                <th rowSpan={2}>Tiendas</th>
                <th rowSpan={2}>
                  Ventas Acum. {getYearFromDate(paramCrecimiento.fecha)}
                </th>
                <th colSpan={6}>Factor Crecimiento</th>
                <th colSpan={7}>Factor Crecimiento</th>
              </tr>
              <tr className="text-right">
                {createTableHeadForYears()}
                <th>
                  {getMonthByNumber(paramCrecimiento.fecha.split("-")[1])}-
                  {getYearFromDate(paramCrecimiento.fecha)}
                </th>
                {createTableHeadForYears()}
              </tr>
            </TableHead>
            <TableBody>
              {crecimiento?.map((item) => (
                <TableRow
                  key={item.tiendas}
                  rowId={item.tiendas}
                  className="text-right text-xs"
                >
                  <td className=" text-left">{item.tiendas}</td>
                  <td>{numberWithCommas(item.ventaAcumuladaActual)}</td>
                  <td className="font-bold">
                    {item[`porcentajeAcumulado${dateRange[0]}`]}
                  </td>
                  <td
                    className={` ${
                      item.tiendas !== "TOTAL" ? "bg-gray-200" : ""
                    }`}
                  >
                    {item[`porcentajeAcumulado${dateRange[1]}`]}
                  </td>
                  <td>{item[`porcentajeAcumulado${dateRange[2]}`]}</td>
                  <td
                    className={` ${
                      item.tiendas !== "TOTAL" ? "bg-gray-200" : ""
                    }`}
                  >
                    {item[`porcentajeAcumulado${dateRange[3]}`]}
                  </td>
                  <td>{item[`porcentajeAcumulado${dateRange[4]}`]}</td>
                  <td
                    className={`text-sm ${
                      item.tiendas !== "TOTAL" ? "bg-gray-200" : ""
                    }`}
                  >
                    {item[`porcentajeAcumulado${dateRange[5]}`]}
                  </td>
                  <td>{numberWithCommas(item.ventaMensualActual)}</td>
                  <td
                    className={`${
                      item.tiendas !== "TOTAL" ? "bg-gray-200 font-bold" : ""
                    }`}
                  >
                    {item[`porcentajeMensual${dateRange[0]}`]}
                  </td>
                  <td>{item[`porcentajeMensual${dateRange[1]}`]}</td>
                  <td
                    className={` ${
                      item.tiendas !== "TOTAL" ? "bg-gray-200" : ""
                    }`}
                  >
                    {item[`porcentajeMensual${dateRange[2]}`]}
                  </td>
                  <td>{item[`porcentajeMensual${dateRange[3]}`]}</td>
                  <td
                    className={`${
                      item.tiendas !== "TOTAL" ? "bg-gray-200" : ""
                    }`}
                  >
                    {item[`porcentajeMensual${dateRange[4]}`]}
                  </td>
                  <td>{item[`porcentajeMensual${dateRange[5]}`]}</td>
                </TableRow>
              ))}
            </TableBody>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const CrecimientoWithAuth = withAuth(Crecimiento);
CrecimientoWithAuth.getLayout = getVentasLayout;
export default CrecimientoWithAuth;
