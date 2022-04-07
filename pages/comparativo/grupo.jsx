import { useState, useEffect, Fragment } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import MessageModal from '../../components/MessageModal';
import { InputContainer, Checkbox, InputDate } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { handleChange } from '../../utils/handlers';
import { getComparativoGrupo } from '../../services/ComparativoService';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import { getBeginCurrentWeekDateRange, getMonthByNumber, getNameDay, getPrevDate, getYearFromDate } from '../../utils/dateFunctions';
import { getDayWeekName, validateDate, getTableName, rowColor, isError } from '../../utils/functions';
import useMessageModal from '../../hooks/useMessageModal';

const Grupo = () => {
  const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();
  const [comparativoGrupo, setComparativoGrupo] = useState({});
  const [acumuladoSemanal, setAcumuladoSemanal] = useState(false);
  const [parametrosGrupo, setParametrosGrupo] = useState({
    fecha: getPrevDate(1),
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    noHorasVentasParciales: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 1,
    tipoCambioTiendas: 0
  });
  const { dateRangeText } = getBeginCurrentWeekDateRange(parametrosGrupo.fecha)

  useEffect(() => {
    if (validateDate(parametrosGrupo.fecha)) {
      getComparativoGrupo(parametrosGrupo)
        .then(response => {
          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setComparativoGrupo(response)
          }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosGrupo]);

  return (
    <>
      <MessageModal message={message} setModalOpen={setModalOpen} modalOpen={modalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate
              value={parametrosGrupo.fecha}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_VS_COMPROMISO}
              name={inputNames.PORCENTAJE_COMPROMISO}
              checked={parametrosGrupo.porcentajeVentasCompromiso ? true : false}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.NO_HORAS_VENTAS_PARCIALES}
              name={inputNames.NO_HORAS_VENTAS_PARCIALES}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.ACUMULADO_SEMANAL}
              onChange={() => setAcumuladoSemanal(prev => !prev)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              checked={parametrosGrupo.sinTiendasSuspendidas ? true : false}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              checked={parametrosGrupo.resultadosPesos ? true : false}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.TIPO_CAMBIO_TIENDAS}
              name={inputNames.TIPO_CAMBIO_TIENDAS}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra un comparativo entre las ventas del año contra el año anterior. El comparativo se realiza por día, mes y año.
        </SmallContainer>
        <SmallContainer>
          Recuerde que la comparación se realiza lunes contra lunes, lo cual quiere decir que las ventas mensuales y anuales saldran con
        </SmallContainer>
        <SmallContainer>
          un dia desface para respetar esto.
        </SmallContainer>
        <SmallContainer>
          En esta temporada de semana santa se habilitará el check para intercambiar los dias de la temporada del año anterior.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer
        title={`COMPARATIVO VENTAS DEL AÑO 
          ${parametrosGrupo.fecha.split("-")[0]} (AL ${parametrosGrupo.fecha.split("-")[2]} DE ${getMonthByNumber(parametrosGrupo.fecha.split("-")[1]).toUpperCase()})`
        }
      >
        {
          Object?.entries(comparativoGrupo ?? {})?.map(([key, value]) => (
            <Fragment key={key}>
              {getTableName(key)}
              <VentasTable className='last-row-bg'>
                <TableHead>
                  <tr>
                    <th rowSpan={2}>Tienda</th>
                    <th colSpan={4}>{getNameDay(parametrosGrupo.fecha)} {getDayWeekName(parametrosGrupo.fecha)}</th>
                    {
                      acumuladoSemanal && <th colSpan={4}>Semana Del {dateRangeText}</th>
                    }
                    <th colSpan={5}>Acumulado {getMonthByNumber(parametrosGrupo.fecha.split("-")[1])}</th>
                    <th colSpan={5}>Acumlado Anual</th>
                    <th rowSpan={2}>Tienda</th>
                  </tr>
                  <tr>
                    <th>{getYearFromDate(parametrosGrupo.fecha)}</th>
                    <th>{Number(getYearFromDate(parametrosGrupo.fecha)) - 1}</th>
                    <th>PPTO.</th>
                    <th>%</th>
                    {
                      acumuladoSemanal && (
                        <>
                          <th>{getYearFromDate(parametrosGrupo.fecha)}</th>
                          <th>{Number(getYearFromDate(parametrosGrupo.fecha)) - 1}</th>
                          <th>PPTO.</th>
                          <th>%</th>
                        </>
                      )
                    }
                    <th>{getYearFromDate(parametrosGrupo.fecha)}</th>
                    <th>{Number(getYearFromDate(parametrosGrupo.fecha)) - 1}</th>
                    <th>PPTO.</th>
                    <th>(-)</th>
                    <th>%</th>
                    <th>{getYearFromDate(parametrosGrupo.fecha)}</th>
                    <th>{Number(getYearFromDate(parametrosGrupo.fecha)) - 1}</th>
                    <th>PPTO.</th>
                    <th>(-)</th>
                    <th>%</th>
                  </tr>
                </TableHead>
                <tbody className='text-center bg-white text-black'>
                  {
                    value?.map(tienda => (
                      <tr key={tienda.tienda} className={rowColor(tienda)}>
                        <td className='font-bold'>{tienda.tienda}</td>
                        <td>{numberWithCommas(tienda.ventasActuales)}</td>
                        <td>{numberWithCommas(tienda.ventasAnterior)}</td>
                        <td>{numberWithCommas(tienda.presupuesto)}</td>
                        {formatNumber(tienda.porcentaje)}
                        {
                          acumuladoSemanal && (
                            <>
                              <td>{numberWithCommas(tienda.ventasSemanalesActual)}</td>
                              <td>{numberWithCommas(tienda.ventasSemanalesAnterior)}</td>
                              <td>{numberWithCommas(tienda.presupuestoSemanal)}</td>
                              {formatNumber(tienda.porcentajeSemanal)}
                            </>
                          )
                        }
                        <td>{numberWithCommas(tienda.ventasMensualesActual)}</td>
                        <td>{numberWithCommas(tienda.ventasMensualesAnterior)}</td>
                        <td>{numberWithCommas(tienda.presupuestoMensual)}</td>
                        {formatNumber(tienda.diferenciaMensual)}
                        {formatNumber(tienda.porcentajeMensual)}
                        <td>{numberWithCommas(tienda.ventasAnualActual)}</td>
                        <td>{numberWithCommas(tienda.ventasAnualAnterior)}</td>
                        <td>{numberWithCommas(tienda.presupuestoAnual)}</td>
                        {formatNumber(tienda.diferenciaAnual)}
                        {formatNumber(tienda.porcentajeAnual)}
                        <td className='font-bold'>{tienda.tienda}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </VentasTable>
            </Fragment>
          ))
        }
      </VentasTableContainer>
    </>
  )
}

Grupo.getLayout = getVentasLayout

export default Grupo
