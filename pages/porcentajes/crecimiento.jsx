import { useState, useEffect, useCallback } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, Checkbox, SelectTiendasGeneral, InputDate } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableBody, TableHead } from '../../components/table';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { getCurrentWeekDateRange, getMonthByNumber, getYearFromDate } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { isError, validateDate } from '../../utils/functions';
import { getPorcentajeCrecimiento } from '../../services/PorcentajesService';
import { numberWithCommas } from '../../utils/resultsFormated';
import useMessageModal from "../../hooks/useMessageModal";
import MessageModal from '../../components/MessageModal';

const Crecimiento = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [dateRange, setDateRange] = useState([]);
  const [crecimiento, setCrecimiento] = useState([]);
  const [parametrosCrecimiento, setParametrosCrecimiento] = useState({
    fecha: getCurrentWeekDateRange()[0],
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 0
  });

  const createDateRange = useCallback(() => {
    const dateRange = [];
    const year = Number(getYearFromDate(parametrosCrecimiento.fecha))
    for (let i = year; i >= year - 5; i--) {
      dateRange.push(i)
    }
    setDateRange(dateRange);
  }, [parametrosCrecimiento.fecha])

  useEffect(() => {
    if (validateDate(parametrosCrecimiento.fecha)) {
      getPorcentajeCrecimiento(parametrosCrecimiento)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createDateRange()
            setCrecimiento(response);
          }

        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosCrecimiento, createDateRange]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate
              value={parametrosCrecimiento.fecha}
              onChange={(e) => handleChange(e, setParametrosCrecimiento)}
            />
            <SelectTiendasGeneral
              value={parametrosCrecimiento.tiendas}
              onChange={(e) => handleChange(e, setParametrosCrecimiento)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setParametrosCrecimiento)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setParametrosCrecimiento)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParametrosCrecimiento)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              checked={parametrosCrecimiento.sinTiendasSuspendidas ? true : false}
              onChange={(e) => handleChange(e, setParametrosCrecimiento)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setParametrosCrecimiento)}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra el factor de crecimiento de las tiendas sobre la ventas del mes y acumuladas,
        </SmallContainer>
        <SmallContainer>
          con respecto a años anteriores segun la fecha especificada.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer
        title={`Factor de crecimiento al 
          ${parametrosCrecimiento.fecha.split("-")[2]} de 
          ${getMonthByNumber(parametrosCrecimiento.fecha.split("-")[1])} de 
          ${getYearFromDate(parametrosCrecimiento.fecha)} Acumulado y Anual`
        }>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Tiendas</th>
              <th rowSpan={2}>Ventas Acum. 2022</th>
              <th colSpan={6}>Factor Crecimiento</th>
              <th colSpan={7}>Factor Crecimiento</th>
            </tr>
            <tr>
              <th>22</th>
              <th>21</th>
              <th>20</th>
              <th>19</th>
              <th>18</th>
              <th>17</th>
              <th>Enero-2022</th>
              <th>22</th>
              <th>21</th>
              <th>20</th>
              <th>19</th>
              <th>18</th>
              <th>17</th>
            </tr>
          </TableHead>
          <TableBody>
            {
              crecimiento?.map(item => (
                <tr key={item.tiendas} className='text-center'>
                  <td>{item.tiendas}</td>
                  <td>{numberWithCommas(item.ventaAcumuladaActual)}</td>
                  <td>{item[`porcentajeAcumulado${dateRange[0]}`]}</td>
                  <td className={`${item.tiendas !== "TOTAL" ? "bg-gray-200" : ""}`}>{item[`porcentajeAcumulado${dateRange[1]}`]}</td>
                  <td>{item[`porcentajeAcumulado${dateRange[2]}`]}</td>
                  <td className={`${item.tiendas !== "TOTAL" ? "bg-gray-200" : ""}`}>{item[`porcentajeAcumulado${dateRange[3]}`]}</td>
                  <td>{item[`porcentajeAcumulado${dateRange[4]}`]}</td>
                  <td className={`${item.tiendas !== "TOTAL" ? "bg-gray-200" : ""}`}>{item[`porcentajeAcumulado${dateRange[5]}`]}</td>
                  <td>{numberWithCommas(item.ventaMensualActual)}</td>
                  <td className={`${item.tiendas !== "TOTAL" ? "bg-gray-200" : ""}`}>{item[`porcentajeMensual${dateRange[0]}`]}</td>
                  <td>{item[`porcentajeMensual${dateRange[1]}`]}</td>
                  <td className={`${item.tiendas !== "TOTAL" ? "bg-gray-200" : ""}`}>{item[`porcentajeMensual${dateRange[2]}`]}</td>
                  <td>{item[`porcentajeMensual${dateRange[3]}`]}</td>
                  <td className={`${item.tiendas !== "TOTAL" ? "bg-gray-200" : ""}`}>{item[`porcentajeMensual${dateRange[4]}`]}</td>
                  <td>{item[`porcentajeMensual${dateRange[5]}`]}</td>
                </tr>
              ))
            }
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Crecimiento.getLayout = getVentasLayout;

export default Crecimiento
