import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { InputContainer, Checkbox, InputDate } from '../../components/inputs';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { getMonthByNumber, getPrevDate, getYearFromDate } from '../../utils/dateFunctions';
import { MessageModal } from '../../components/modals';
import { handleChange } from '../../utils/handlers';
import { getTableName, isError, validateDate } from '../../utils/functions';
import { getComparativoPlazas } from '../../services/ComparativoService';
import { Fragment } from 'react/cjs/react.production.min';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';

const Plazas = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [comparativoPlazas, setComparativoPlazas] = useState({});
  const [semanaSanta, setSemanaSanta] = useState(true);
  const [parametrosPlazas, setParametrosPlazas] = useState({
    fecha: getPrevDate(1),
    conIva: 0,
    porcentajeVentasCompromiso: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 1,
    resultadosPesos: 1,
    tipoCambioTiendas: 0
  });

  useEffect(() => {
    if (validateDate(parametrosPlazas.fecha)) {
      getComparativoPlazas(parametrosPlazas)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setComparativoPlazas(response)
          }

        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosPlazas]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate
              value={parametrosPlazas.fecha}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_VS_COMPROMISO}
              name={inputNames.PORCENTAJE_COMPROMISO}
              checked={parametrosPlazas.porcentajeVentasCompromiso ? true : false}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.SEMANA_SANTA}
              name={inputNames.SEMANA_SANTA}
              checked={semanaSanta}
              onChange={() => setSemanaSanta(prev => !prev)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={() => { }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              checked={parametrosPlazas.sinTiendasSuspendidas ? true : false}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              checked={parametrosPlazas.resultadosPesos ? true : false}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.TIPO_CAMBIO_TIENDAS}
              name={inputNames.TIPO_CAMBIO_TIENDAS}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
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
      </ParametersContainer>

      <VentasTableContainer
        title={`COMPARATIVO VENTAS DEL AÑO 
          ${parametrosPlazas.fecha.split("-")[0]} (AL ${parametrosPlazas.fecha.split("-")[2]} DE ${getMonthByNumber(parametrosPlazas.fecha.split("-")[1]).toUpperCase()})`
        }
      >
        {
          Object.entries(comparativoPlazas)?.map(([key, value]) => (
            <Fragment key={key}>
              {getTableName(key)}
              <VentasTable className='last-row-bg'>
                <TableHead>
                  <tr>
                    <th rowSpan={2}>Plaza</th>
                    <th colSpan={5}>Acumulado {getMonthByNumber(parametrosPlazas.fecha.split("-")[1])}</th>
                    <th colSpan={5}>Acumulado Anual</th>
                  </tr>
                  <tr>
                    <th>{getYearFromDate(parametrosPlazas.fecha)}</th>
                    <th>{Number(getYearFromDate(parametrosPlazas.fecha)) - 1}</th>
                    <th>PPTO.</th>
                    <th>(-)</th>
                    <th>%</th>
                    <th>{getYearFromDate(parametrosPlazas.fecha)}</th>
                    <th>{Number(getYearFromDate(parametrosPlazas.fecha)) - 1}</th>
                    <th>PPTO.</th>
                    <th>(-)</th>
                    <th>%</th>
                  </tr>
                </TableHead>
                <tbody className='text-center'>
                  {
                    value.map(plaza => (
                      <tr key={plaza.plaza} className='bg-white text-black'>
                        <td>{plaza.plaza}</td>
                        <td>{numberWithCommas(plaza.ventasMensualesActual)}</td>
                        <td>{numberWithCommas(plaza.ventasMensualesAnterior)}</td>
                        <td>{numberWithCommas(plaza.presupuestoMensual)}</td>
                        {formatNumber(plaza.diferenciaMensual)}
                        {formatNumber(plaza.porcentajeMensual)}
                        <td>{numberWithCommas(plaza.ventasAnualActual)}</td>
                        <td>{numberWithCommas(plaza.ventasAnualAnterior)}</td>
                        <td>{numberWithCommas(plaza.presupuestoAnual)}</td>
                        {formatNumber(plaza.diferenciaAnual)}
                        {formatNumber(plaza.porcentajeAnual)}
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

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
