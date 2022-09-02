import { useEffect, useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
  Checkbox,
  InputToYear,
} from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableBody,
  TableRow,
} from "../../components/table";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import { getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { numberWithCommas } from "../../utils/resultsFormated";
import { getPorcenatajesParticipacion } from "../../services/PorcentajesService";
import { validateYear } from "../../utils/functions";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Participacion = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [participacionVentas, setParticipacionVentas] = useState([]);
  const [parametrosParticipacion, setParametrosParticipacion] = useState({
    alAgno: getCurrentYear(),
    tiendas: 0,
    conIva: config?.conIva || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas|| 0,
    sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
    resultadosPesos: config?.resultadosPesos || 0,
  });


  useEffect(() => {
    (async()=>{
      if(validateYear(parametrosParticipacion.alAgno)){
        try{
          const response = await getPorcenatajesParticipacion(parametrosParticipacion);
          setParticipacionVentas(response);
        }catch(error){
          sendNotification({
            type:'ERROR',
            message: error.response.data.message || error.message
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosParticipacion, parametrosParticipacion.alAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`PARTICIPACION DE VENTAS DE TIENDAS EN EL AÑO ${parametrosParticipacion.alAgno}`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendasGeneral
                value={parametrosParticipacion.tiendas}
                onChange={(e) => handleChange(e, setParametrosParticipacion)}
              />
              <InputToYear
                value={parametrosParticipacion.alAgno}
                onChange={(e) => handleChange(e, setParametrosParticipacion)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={parametrosParticipacion.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setParametrosParticipacion)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={parametrosParticipacion.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setParametrosParticipacion)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={parametrosParticipacion.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setParametrosParticipacion)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                checked={parametrosParticipacion.sinTiendasSuspendidas ? true : false}
                onChange={(e) => handleChange(e, setParametrosParticipacion)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                checked={parametrosParticipacion.resultadosPesos ? true : false}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setParametrosParticipacion)}
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
                <th rowSpan={2}>TDA.</th>
                <th colSpan={2}>ENE</th>
                <th colSpan={2}>FEB</th>
                <th colSpan={2}>MAR</th>
                <th colSpan={2}>ABR</th>
                <th colSpan={2}>MAY</th>
                <th colSpan={2}>JUN</th>
                <th colSpan={2}>JUL</th>
                <th colSpan={2}>AGO</th>
                <th colSpan={2}>SEP</th>
                <th colSpan={2}>OCT</th>
                <th colSpan={2}>NOV</th>
                <th colSpan={2}>DIC</th>
                <th rowSpan={2}>TOTAL AÑO</th>
              </tr>
              <tr className="text-right">
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
                <th>$</th>
                <th>%</th>
              </tr>
            </TableHead>
            <TableBody>
              {participacionVentas?.map((venta, index) => (
                <TableRow
                  key={venta.tienda}
                  rowId={venta.tienda}
                  className="text-right text-xs"
                >
                  {index + 1 === participacionVentas.length ? (
                    <>
                      <td className="text-left">{venta.tienda}</td>
                      <td colSpan={2}>{numberWithCommas(venta.enero)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.febrero)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.marzo)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.abril)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.mayo)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.junio)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.julio)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.agosto)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.septiembre)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.octubre)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.noviembre)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.diciembre)}</td>
                      <td colSpan={2}>{numberWithCommas(venta.total)}</td>
                    </>
                  ) : (
                    <>
                      <td className="text-left">{venta.tienda}</td>
                      <td>{numberWithCommas(venta.enero)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeEnero)}
                      </td>
                      <td>{numberWithCommas(venta.febrero)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeFebrero)}
                      </td>
                      <td>{numberWithCommas(venta.marzo)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeMarzo)}
                      </td>
                      <td>{numberWithCommas(venta.abril)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeAbril)}
                      </td>
                      <td>{numberWithCommas(venta.mayo)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeMayo)}
                      </td>
                      <td>{numberWithCommas(venta.junio)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeJunio)}
                      </td>
                      <td>{numberWithCommas(venta.julio)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeJulio)}
                      </td>
                      <td>{numberWithCommas(venta.agosto)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeAgosto)}
                      </td>
                      <td>{numberWithCommas(venta.septiembre)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeSeptiembre)}
                      </td>
                      <td>{numberWithCommas(venta.octubre)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeOctubre)}
                      </td>
                      <td>{numberWithCommas(venta.noviembre)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeNoviembre)}
                      </td>
                      <td>{numberWithCommas(venta.diciembre)}</td>
                      <td className="bg-gray-200">
                        {numberWithCommas(venta.porcentajeDiciembre)}
                      </td>
                      <td>{numberWithCommas(venta.total)}</td>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const ParticipacionWithAuth = withAuth(Participacion);
ParticipacionWithAuth.getLayout = getVentasLayout;
export default ParticipacionWithAuth;
