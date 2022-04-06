import { useState, useEffect, Fragment } from 'react';
import { SmallContainer, ParametersContainer, Parameters } from '../../components/containers';
import { getVentasLayout} from '../../components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { InputContainer, Checkbox, InputOfTheDate, InputVsYear } from '../../components/inputs';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import MessageModal from '../../components/MessageModal';
import { getCurrentDate, getCurrentYear, getYearFromDate, semanaSanta } from '../../utils/dateFunctions';
import { getDayName, rowColor, validateDate, validateYear, getTableName, dateRangeTitleSemanaSanta, isError } from '../../utils/functions';
import { handleChange } from '../../utils/handlers';
import { getSemanaSantaAcumulado } from '../../services/semanaSantaService';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import useMessageModal from '../../hooks/useMessageModal';

const Acumulado = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [fechaInicioSemana, setFechaInicioSemana] = useState(semanaSanta(getCurrentYear())[0]);
  const [acumulado, setAcumulado] = useState([]);
  const [paramAcumulado, setParamAcumulado] = useState({
    fecha: getCurrentDate(true),
    versusAgno: getCurrentYear() - 1,
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    incluirFinSemanaAnterior: 1,
    resultadosPesos: 1
  });

  useEffect(() => {
    if (validateDate(paramAcumulado.fecha) && validateYear(paramAcumulado.versusAgno)) {
      getSemanaSantaAcumulado(paramAcumulado)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data ?? MENSAJE_ERROR);
            setModalOpen(true)
          } else {
            setAcumulado(response)
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramAcumulado]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputOfTheDate 
              value={paramAcumulado.fecha}
              onChange={(e) => {
                handleChange(e, setParamAcumulado);
                setFechaInicioSemana(semanaSanta(getYearFromDate(paramAcumulado.fecha))[0])
              }}
            />
            <InputVsYear 
              value={paramAcumulado.versusAgno}
              onChange={(e) => handleChange(e, setParamAcumulado)}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setParamAcumulado)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_LOGRO}
              name={inputNames.PORCENTAJE_COMPROMISO}
              onChange={(e) => handleChange(e, setParamAcumulado)}
              checked={paramAcumulado.porcentajeVentasCompromiso}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setParamAcumulado)}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParamAcumulado)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}
              name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}
              onChange={(e) => handleChange(e, setParamAcumulado)}
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
        <SmallContainer>
          Este reporte muestra la venta del dia y la venta acumulada de la semana santa en la fecha especificada.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title={`Ventas Semana Santa del año ${getYearFromDate(paramAcumulado.fecha)}`}>
        {
          Object.entries(acumulado).map(([key, value]) => (
            <Fragment key={key}>
              {getTableName(key)}
              <VentasTable className='last-row-bg'>
                <TableHead>
                  <tr>
                    <td rowSpan={3} className='border border-white'>Tienda</td>
                    <td colSpan={10} className='border border-white'>{getDayName(paramAcumulado.fecha)}</td>
                    <td colSpan={4} className='border border-white'>{dateRangeTitleSemanaSanta(fechaInicioSemana, paramAcumulado.fecha)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className='border border-white'>Venta</td>
                    <td colSpan={3} className='border border-white'>Promedio</td>
                    <td colSpan={3} className='border border-white'>Operaciones</td>
                    <td colSpan={4} className='border border-white'>Venta</td>
                  </tr>
                  <tr>
                    <td rowSpan={2} className='border border-white'>{getYearFromDate(paramAcumulado.fecha)}</td>
                    <td rowSpan={2} className='border border-white'>{paramAcumulado.versusAgno}</td>
                    <td rowSpan={2} className='border border-white'>PPTO.</td>
                    <td rowSpan={2} className='border border-white'>%</td>
                    <td rowSpan={2} className='border border-white'>{getYearFromDate(paramAcumulado.fecha)}</td>
                    <td rowSpan={2} className='border border-white'>{paramAcumulado.versusAgno}</td>
                    <td rowSpan={2} className='border border-white'>%</td>
                    <td rowSpan={2} className='border border-white'>{getYearFromDate(paramAcumulado.fecha)}</td>
                    <td rowSpan={2} className='border border-white'>{paramAcumulado.versusAgno}</td>
                    <td rowSpan={2} className='border border-white'>%</td>
                    <td rowSpan={2} className='border border-white'>{getYearFromDate(paramAcumulado.fecha)}</td>
                    <td rowSpan={2} className='border border-white'>{paramAcumulado.versusAgno}</td>
                    <td rowSpan={2} className='border border-white'>PPTO.</td>
                    <td rowSpan={3} className='border border-white'>%</td>
                  </tr>
                </TableHead>
                <tbody className='bg-white text-center'>
                  {
                    value?.map((venta) => (
                      <tr key={venta.tienda} className={rowColor(venta)}>
                        <td>{venta.tienda}</td>
                        <td>{numberWithCommas(venta.ventaActual)}</td>
                        <td>{numberWithCommas(venta.ventaAnterior)}</td>
                        <td>{numberWithCommas(venta.presupuesto)}</td>
                        {formatNumber(venta.porcentaje)}
                        <td>{numberWithCommas(venta.promedioActual)}</td>
                        <td>{numberWithCommas(venta.promedioAnterior)}</td>
                        {formatNumber(venta.porcentajePromedios)}
                        <td>{numberWithCommas(venta.operacionesActual)}</td>
                        <td>{numberWithCommas(venta.operacionesAnterior)}</td>
                        {formatNumber(venta.porcentajeOperaciones)}
                        <td>{numberWithCommas(venta.ventaAcumuladaActual)}</td>
                        <td>{numberWithCommas(venta.ventaAcumuladaAnterior)}</td>
                        <td>{numberWithCommas(venta.presupuestoAcumulado)}</td>
                        {formatNumber(venta.porcentajeAcumulado)}
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

Acumulado.getLayout = getVentasLayout;

export default Acumulado
