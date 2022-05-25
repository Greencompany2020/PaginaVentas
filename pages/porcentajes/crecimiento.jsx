import { useState, useEffect, useCallback } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, Checkbox, SelectTiendasGeneral, InputDate } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableBody, TableHead, TableRow } from '../../components/table';
import { MessageModal } from '../../components/modals';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { getMonthByNumber, getPrevDate, getYearFromDate } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getLastTwoNumbers, isError, validateDate } from '../../utils/functions';
import { getPorcentajeCrecimiento } from '../../services/PorcentajesService';
import { numberWithCommas } from '../../utils/resultsFormated';
import useMessageModal from "../../hooks/useMessageModal";
import withAuth from '../../components/withAuth';

const Crecimiento = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [dateRange, setDateRange] = useState([]);
  const [crecimiento, setCrecimiento] = useState([]);
  const [paramCrecimiento, setParamCrecimiento] = useState({
    fecha: getPrevDate(1),
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 0
  });

  const createDateRange = useCallback(() => {
    const dateRange = [];
    const year = Number(getYearFromDate(paramCrecimiento.fecha))
    for (let i = year; i >= year - 5; i--) {
      dateRange.push(i)
    }
    setDateRange(dateRange);
  }, [paramCrecimiento.fecha])

  useEffect(() => {
    if (validateDate(paramCrecimiento.fecha)) {
      getPorcentajeCrecimiento(paramCrecimiento)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createDateRange()
            setCrecimiento(response);
          }

        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramCrecimiento, createDateRange]);

  const createTableHeadForYears = () => {
    return dateRange.map((year) => (
      <th key={year}>
        {getLastTwoNumbers(year)}
      </th>
    ));
  }

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
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
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setParamCrecimiento)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setParamCrecimiento)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParamCrecimiento)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              checked={paramCrecimiento.sinTiendasSuspendidas ? true : false}
              onChange={(e) => handleChange(e, setParamCrecimiento)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setParamCrecimiento)}
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
          ${paramCrecimiento.fecha.split("-")[2]} de 
          ${getMonthByNumber(paramCrecimiento.fecha.split("-")[1])} de 
          ${getYearFromDate(paramCrecimiento.fecha)} Acumulado y Anual`
        }>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Tiendas</th>
              <th rowSpan={2}>Ventas Acum. {getYearFromDate(paramCrecimiento.fecha)}</th>
              <th colSpan={6}>Factor Crecimiento</th>
              <th colSpan={7}>Factor Crecimiento</th>
            </tr>
            <tr>
              {createTableHeadForYears()}
              <th>{getMonthByNumber(paramCrecimiento.fecha.split("-")[1])}-{getYearFromDate(paramCrecimiento.fecha)}</th>
              {createTableHeadForYears()}
            </tr>
          </TableHead>
          <TableBody>
            {
              crecimiento?.map(item => (
                <TableRow key={item.tiendas} rowId={item.tiendas} className='text-center'>
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
                </TableRow>
              ))
            }
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const CrecimientoWithAuth = withAuth(Crecimiento);
CrecimientoWithAuth.getLayout = getVentasLayout;
export default CrecimientoWithAuth;
