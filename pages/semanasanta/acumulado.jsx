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
  TableRow,
} from "../../components/table";
import {
  InputContainer,
  Checkbox,
  InputOfTheDate,
  InputVsYear,
  SelectTiendasCombo,
  SelectCompromiso,
} from "../../components/inputs";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import {
  getCurrentDate,
  getCurrentYear,
  getYearFromDate,
  semanaSanta,
} from "../../utils/dateFunctions";
import {
  getDayName,
  rowColor,
  validateDate,
  validateYear,
  getTableName,
  dateRangeTitleSemanaSanta,
} from "../../utils/functions";
import { handleChange } from "../../utils/handlers";
import { getSemanaSantaAcumulado } from "../../services/semanaSantaService";
import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Acumulado = (props) => {
  const {config} = props;
  const sendNotification = useNotification;
  const [fechaInicioSemana, setFechaInicioSemana] = useState(
    semanaSanta(getCurrentYear())[0]
  );
  const [acumulado, setAcumulado] = useState([]);
  const [paramAcumulado, setParamAcumulado] = useState({
    fecha: getCurrentDate(true),
    versusAgno: getCurrentYear() - 1,
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    incluirFinSemanaAnterior: 1,
    resultadosPesos: 1,
  });
  const [finSemana, setFinSemana] = useState(
    paramAcumulado.incluirFinSemanaAnterior ? true : false
  );

  useEffect(()=>{
    setParamAcumulado(prev => ({
      ...prev,
      conIva: config?.conIva || 0,
      porcentajeVentasCompromiso: config?.porcentajeVentasCompromiso || 0,
      conVentasEventos: config?.conVentasEventos || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      incluirFinSemanaAnterior: config?.incluirFinSemanaAnterior || 0,
      resultadosPesos: config?.resultadosPesos || 0,
    }))
  },[config])

  useEffect(() => {
    (async()=>{
      if( validateDate(paramAcumulado.fecha) && validateYear(paramAcumulado.versusAgno)){
        try {
          const response = await getSemanaSantaAcumulado(paramAcumulado);
          setAcumulado(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramAcumulado]);

  useEffect(() => {
    setFechaInicioSemana(
      semanaSanta(getYearFromDate(paramAcumulado.fecha), false, finSemana)[0]
    );
  }, [finSemana, paramAcumulado.fecha]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas Semana Santa del año ${getYearFromDate(
          paramAcumulado.fecha
        )}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputOfTheDate
                value={paramAcumulado.fecha}
                onChange={(e) => {
                  handleChange(e, setParamAcumulado);
                  setFechaInicioSemana(
                    semanaSanta(
                      getYearFromDate(paramAcumulado.fecha),
                      false,
                      false
                    )[0]
                  );
                }}
              />
              <InputVsYear
                value={paramAcumulado.versusAgno}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
              <SelectTiendasCombo
                value={'awanta'}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
              <SelectCompromiso
                value={'awanta'}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                checked={paramAcumulado.conIva ? true : false}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                checked={paramAcumulado.conVentasEventos ? true : false}
                onChange={(e) => handleChange(e, setParamAcumulado)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}
                name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}
                onChange={(e) => {
                  handleChange(e, setParamAcumulado);
                  setFinSemana((prev) => !prev);
                }}
                checked={paramAcumulado.incluirFinSemanaAnterior}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setParamAcumulado)}
                checked={paramAcumulado.resultadosPesos}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer>
          {Object.entries(acumulado).map(([key, value]) => (
            <Fragment key={key}>
              {getTableName(key)}
              <VentasTable className="tfooter">
                <TableHead>
                  <tr>
                    <th rowSpan={3} className="border border-white">
                      Tienda
                    </th>
                    <th colSpan={10} className="border border-white">
                      {getDayName(paramAcumulado.fecha)}
                    </th>
                    <th colSpan={4} className="border border-white">
                      {dateRangeTitleSemanaSanta(
                        fechaInicioSemana,
                        paramAcumulado.fecha
                      )}
                    </th>
                  </tr>
                  <tr className="text-right">
                    <th colSpan={4} className="border border-white">
                      Venta
                    </th>
                    <th colSpan={3} className="border border-white">
                      Promedio
                    </th>
                    <th colSpan={3} className="border border-white">
                      Operaciones
                    </th>
                    <th colSpan={4} className="border border-white">
                      Venta
                    </th>
                  </tr>
                  <tr className="text-right">
                    <th rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      PPTO.
                    </th>
                    <th rowSpan={2} className="border border-white">
                      %
                    </th>
                    <th rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      %
                    </th>
                    <th rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      %
                    </th>
                    <th rowSpan={2} className="border border-white">
                      {getYearFromDate(paramAcumulado.fecha)}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      {paramAcumulado.versusAgno}
                    </th>
                    <th rowSpan={2} className="border border-white">
                      PPTO.
                    </th>
                    <th rowSpan={3} className="border border-white">
                      %
                    </th>
                  </tr>
                </TableHead>
                <tbody className="bg-white text-right text-xs">
                  {
                    (()=>{
                      if(value){
                        const count = value.length - 1;
                        const Items = value?.map((venta, index) => (
                          <TableRow
                            key={venta.tienda}
                            rowId={venta.tienda}
                            className={rowColor(venta)}
                          >
                            <td className="text-left">{venta.tienda}</td>
                            <td className="font-bold">
                              {numberWithCommas(venta.ventaActual)}
                            </td>
                            <td>{numberWithCommas(venta.ventaAnterior)}</td>
                            <td>{numberWithCommas(venta.presupuesto)}</td>
                            {formatNumber(venta.porcentaje, count == index)}
                            <td className="font-bold">
                              {numberWithCommas(venta.promedioActual)}
                            </td>
                            <td>{numberWithCommas(venta.promedioAnterior)}</td>
                            {formatNumber(venta.porcentajePromedios, count == index)}
                            <td className="font-bold">
                              {numberWithCommas(venta.operacionesActual)}
                            </td>
                            <td>{numberWithCommas(venta.operacionesAnterior)}</td>
                            {formatNumber(venta.porcentajeOperaciones, count == index)}
                            <td className="font-bold">
                              {numberWithCommas(venta.ventaAcumuladaActual)}
                            </td>
                            <td>{numberWithCommas(venta.ventaAcumuladaAnterior)}</td>
                            <td>{numberWithCommas(venta.presupuestoAcumulado)}</td>
                            {formatNumber(venta.porcentajeAcumulado, count == index)}
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
      </section>
    </div>
  );
};

const AcumuladoWithAuth = withAuth(Acumulado);
AcumuladoWithAuth.getLayout = getVentasLayout;
export default AcumuladoWithAuth;
