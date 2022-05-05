import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer, Flex } from '../../components/containers';
import { InputContainer, InputYear, InputToYear, Checkbox, SelectTiendas, SelectPlazas } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableBody, TableHead } from '../../components/table';
import { MessageModal } from '../../components/modals';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { getInitialPlaza, getInitialTienda, isError, validateYearRange } from '../../utils/functions';
import { formatedDate, formatLastDate, getPrevDate, getYearFromDate } from '../../utils/dateFunctions';
import { numberWithCommas } from '../../utils/resultsFormated';
import { handleChange } from '../../utils/handlers';
import { getPorcentajesMensuales } from '../../services/PorcentajesService';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';
import { useUser } from "../../context/UserContext";


const Mensuales = () => {
  const { tiendas, plazas } = useUser();
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
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
    resultadosPesos: 0
  });
  const [toggleTienda, setToggleTienda] = useState(true);
  const [togglePlaza, setTogglePlaza] = useState(false);

  useEffect(() => {
    if (validateYearRange(parametrosMensuales.delAgno, parametrosMensuales.alAgno)) {
      getPorcentajesMensuales(parametrosMensuales)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setPorcentajesMensuales(response)
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosMensuales]);

  const handleVisibleTienda = () => {
    setToggleTienda(true);
    setParametrosMensuales(prev => ({
      ...prev,
      queryTiendaPlaza: 0
    }));
    setTogglePlaza(false);
  }

  const handleVisiblePlaza = () => {
    setTogglePlaza(true);
    setParametrosMensuales(prev => ({
      ...prev,
      queryTiendaPlaza: 1
    }));
    setToggleTienda(false);
  }

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <Flex className='mb-3'>
              <p className='mr-3'>Mostrar: </p>
              <Flex>
                <button onClick={handleVisibleTienda} className='buttonToggle mr-1'>Por Tienda</button>
                <button onClick={handleVisiblePlaza} className='buttonToggle'>Por Plaza</button>
              </Flex>
            </Flex>
            {
              toggleTienda && <SelectTiendas value={parametrosMensuales.tienda} onChange={(e) => handleChange(e, setParametrosMensuales)} />
            }
            {
              togglePlaza && <SelectPlazas value={parametrosMensuales.plaza} onChange={(e) => handleChange(e, setParametrosMensuales)} />
            }
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
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setParametrosMensuales)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setParametrosMensuales)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParametrosMensuales)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setParametrosMensuales)}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          ESTA GRAFICA MUESTRA UN EL PORCENTAJE DE VENTA DEL MES EN RAZON DE LA VENTA ANUAL LA TIENDA SELECCIONADA EN EL RANGO DE AÑOS ESPECIFICADO.
        </SmallContainer>
        <SmallContainer>
          RECUERDE QUE EL RANGO DE AÑOS DEBE SER CAPTURADO DE MENOR A EL MAYOR, AUNQUE EN EL REPORTE SE MOSTRARA EN ORDEN DESCENDENTE.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title={`PROPORCION DE VENTAS MENSUALES VS. VENTA ANUAL - Ventas al ${formatLastDate(getPrevDate(0, parametrosMensuales.alAgno))}`}>
        <VentasTable className='last-row-bg'>
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
            <tr>
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
              porcentajesMensuales?.map((item, index) => (
                <tr className='text-center' key={item.agno}>
                  <td>{item.agno}</td>
                  <td>{numberWithCommas(item.enero)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeEnero}</td>
                  <td>{numberWithCommas(item.febrero)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeFebrero}</td>
                  <td>{numberWithCommas(item.marzo)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeMarzo}</td>
                  <td>{numberWithCommas(item.abril)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeAbril}</td>
                  <td>{numberWithCommas(item.mayo)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeMayo}</td>
                  <td>{numberWithCommas(item.junio)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeJunio}</td>
                  <td>{numberWithCommas(item.julio)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeJulio}</td>
                  <td>{numberWithCommas(item.agosto)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeAgosto}</td>
                  <td>{numberWithCommas(item.septiembre)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeSeptiembre}</td>
                  <td>{numberWithCommas(item.octubre)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeOctubre}</td>
                  <td>{numberWithCommas(item.noviembre)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeNoviembre}</td>
                  <td>{numberWithCommas(item.diciembre)}</td>
                  <td className={index !== porcentajesMensuales.length - 1 ? "bg-gray-200" : ""}>{item.porcentajeDiciembre}</td>
                  <td>{numberWithCommas(item.total)}</td>
                </tr>
              ))
            }
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const MensualesWithAuth = withAuth(Mensuales);
MensualesWithAuth.getLayout = getVentasLayout;
export default MensualesWithAuth;
