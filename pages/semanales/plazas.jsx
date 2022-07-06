import { useEffect, useState } from "react";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  InputDateRange,
  Checkbox,
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
import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Plazas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [semanalesPlaza, setSemanalesPlaza] = useState([]);
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
    }))
  },[config])

  useEffect(() => {
    (async()=>{
      if(validateInputDateRange(plazasParametros.fechaInicio,plazasParametros.fechaFin)){
        try {
          const response = await getSemanalesPlazas(plazasParametros);
          setSemanalesPlaza(response)
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

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Detalles de información / Semanales por plaza" />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputDateRange
              onChange={(e) => handleChange(e, setPlazasParametros)}
              beginDate={plazasParametros.fechaInicio}
              endDate={plazasParametros.fechaFin}
            />
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={plazasParametros.conIva ? 1 : 0}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={plazasParametros.conVentasEventos ? 1 : 0}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={plazasParametros.conTiendasCerradas ? 1 : 0}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                checked={plazasParametros.sinAgnoVenta ? 1 : 0}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => handleChange(e, setPlazasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                checked={plazasParametros.sinTiendasSuspendidas ? 1 : 0}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
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
      </section>

      <section className="p-4 overflow-y-auto ">
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
      </section>
    </div>
  );
};

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
