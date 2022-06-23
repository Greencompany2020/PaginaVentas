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
  isError,
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
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Mensuales = () => {
  const sendNotification = useNotification();
  const { tiendas, plazas } = useAuth();
  const [porcentajesMensuales, setPorcentajesMensuales] = useState([]);
  const [parametrosMensuales, setParametrosMensuales] = useState({
    queryTiendaPlaza: 0,
    tienda: getInitialTienda(tiendas),
    plaza: getInitialPlaza(plazas),
    delAgno: Number(getYearFromDate(formatedDate())) - 5,
    alAgno: Number(getYearFromDate(formatedDate())),
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0,
  });
  const [toggleTienda, setToggleTienda] = useState(true);
  const [togglePlaza, setTogglePlaza] = useState(false);

  useEffect(()=>{
    if(tiendas && plazas){
      setParametrosMensuales(prev => ({...prev, tienda:getInitialTienda(tiendas), plaza:getInitialPlaza(plazas)}));
    }
  },[tiendas, plazas])

  useEffect(() => {
    (async()=>{
      if(validateYearRange(parametrosMensuales.delAgno, parametrosMensuales.alAgno) && (tiendas && plazas)){
        try {
          const response = await getPorcentajesMensuales(parametrosMensuales);
          setPorcentajesMensuales(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: error.message ?? MENSAJE_ERROR
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

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
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
              <InputYear
                value={parametrosMensuales.delAgno}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
              <InputToYear
                value={parametrosMensuales.alAgno}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setParametrosMensuales)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
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
