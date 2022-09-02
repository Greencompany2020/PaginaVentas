import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
  Flex,
} from "../../components/containers";
import {
  InputContainer,
  InputYear,
  InputToYear,
  Checkbox,
  SelectTiendas,
  SelectPlazas,
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
  getInitialPlaza,
  getInitialTienda,
  validateYearRange,
} from "../../utils/functions";
import {
  formatedDate,
  formatLastDate,
  getPrevDate,
  getYearFromDate,
} from "../../utils/dateFunctions";
import { numberWithCommas } from "../../utils/resultsFormated";
import { handleChange } from "../../utils/handlers";
import { getPorcentajesMensuales } from "../../services/PorcentajesService";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { useSelector } from "react-redux";

const Mensuales = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const {places, shops} = useSelector(state => state);
  const [porcentajesMensuales, setPorcentajesMensuales] = useState([]);
  const [parametrosMensuales, setParametrosMensuales] = useState({
    queryTiendaPlaza: 0,
    tienda: getInitialTienda(shops),
    plaza: getInitialPlaza(places),
    delAgno: Number(getYearFromDate(formatedDate())) - 1,
    alAgno: Number(getYearFromDate(formatedDate())),
    conIva: config?.conIva || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    resultadosPesos: config?.resultadosPesos || 0,
  });
  const [toggleTienda, setToggleTienda] = useState(true);
  const [togglePlaza, setTogglePlaza] = useState(false);

 
  useEffect(() => {
    (async()=>{
      if(validateYearRange(parametrosMensuales.delAgno, parametrosMensuales.alAgno) && (shops && places)){
        try {
          const response = await getPorcentajesMensuales(parametrosMensuales);
          setPorcentajesMensuales(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: error.response.data.message || error.message
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosMensuales, parametrosMensuales.delAgno]);

  const handleVisibleTienda = () => {
    setToggleTienda(true);
    setParametrosMensuales((prev) => ({
      ...prev,
      queryTiendaPlaza: 0,
    }));
    setTogglePlaza(false);
  };

  const handleVisiblePlaza = () => {
    setTogglePlaza(true);
    setParametrosMensuales((prev) => ({
      ...prev,
      queryTiendaPlaza: 1,
    }));
    setToggleTienda(false);
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`PROPORCION DE VENTAS MENSUALES VS. VENTA ANUAL - Ventas al ${formatLastDate(
          getPrevDate(0, parametrosMensuales.alAgno)
        )}`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <Flex className="mb-3">
                <p className="mr-3">Mostrar: </p>
                <Flex>
                  <button
                    onClick={handleVisibleTienda}
                    className="buttonToggle mr-1"
                  >
                    Por Tienda
                  </button>
                  <button onClick={handleVisiblePlaza} className="buttonToggle">
                    Por Plaza
                  </button>
                </Flex>
              </Flex>
              {toggleTienda && (
                <SelectTiendas
                  value={parametrosMensuales.tienda}
                  onChange={(e) => handleChange(e, setParametrosMensuales)}
                />
              )}
              {togglePlaza && (
                <SelectPlazas
                  value={parametrosMensuales.plaza}
                  onChange={(e) => handleChange(e, setParametrosMensuales)}
                />
              )}
            </InputContainer>
            <InputContainer>
              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <InputYear
                    value={parametrosMensuales.delAgno}
                    onChange={(e) => handleChange(e, setParametrosMensuales)}
                  />
                </div>
                <div className="flex-1">
                  <InputToYear
                    value={parametrosMensuales.alAgno}
                    onChange={(e) => handleChange(e, setParametrosMensuales)}
                  />
                </div>
              </fieldset>
              
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={parametrosMensuales.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={parametrosMensuales.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={parametrosMensuales.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                checked={parametrosMensuales.resultadosPesos ? true : false}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
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
                <th rowSpan={2}>Año</th>
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
                <th rowSpan={2}>TOTAL ANUAL</th>
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
              {
                (()=>{
                  if(Array.isArray(porcentajesMensuales)){
                    const Items = porcentajesMensuales?.map((item, index) => (
                      <TableRow
                        key={item.agno}
                        rowId={item.agno}
                        className=" text-right text-xs"
                      >
                        <td>{item.agno}</td>
                        <td>{numberWithCommas(item.enero)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeEnero}
                        </td>
                        <td>{numberWithCommas(item.febrero)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeFebrero}
                        </td>
                        <td>{numberWithCommas(item.marzo)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeMarzo}
                        </td>
                        <td>{numberWithCommas(item.abril)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeAbril}
                        </td>
                        <td>{numberWithCommas(item.mayo)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeMayo}
                        </td>
                        <td>{numberWithCommas(item.junio)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeJunio}
                        </td>
                        <td>{numberWithCommas(item.julio)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeJulio}
                        </td>
                        <td>{numberWithCommas(item.agosto)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeAgosto}
                        </td>
                        <td>{numberWithCommas(item.septiembre)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeSeptiembre}
                        </td>
                        <td>{numberWithCommas(item.octubre)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeOctubre}
                        </td>
                        <td>{numberWithCommas(item.noviembre)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeNoviembre}
                        </td>
                        <td>{numberWithCommas(item.diciembre)}</td>
                        <td
                          className={
                            index !== porcentajesMensuales.length - 1
                              ? "bg-gray-200"
                              : ""
                          }
                        >
                          {item.porcentajeDiciembre}
                        </td>
                        <td>{numberWithCommas(item.total)}</td>
                      </TableRow>
                    ));
                    return Items;
                  }
                  return <></>
                })()
              }
            </TableBody>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const MensualesWithAuth = withAuth(Mensuales);
MensualesWithAuth.getLayout = getVentasLayout;
export default MensualesWithAuth;
