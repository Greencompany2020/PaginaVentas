import { useEffect, useState } from 'react';
import { SmallContainer, ParametersContainer, Parameters } from '../../components/containers';
import { InputContainer, InputDateRange, Checkbox } from '../../components/inputs'
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead, TableRow } from '../../components/table';
import { getSemanalesPlazas } from '../../services/SemanalesService';
import { checkboxLabels, MENSAJE_ERROR } from '../../utils/data'
import { inputNames } from '../../utils/data/checkboxLabels';
import { getCurrentWeekDateRange, getYearFromDate } from '../../utils/dateFunctions';
import { dateRangeTitle, isError, validateInputDateRange } from '../../utils/functions';
import { handleChange } from '../../utils/handlers';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import withAuth from '../../components/withAuth';
import {useAlert} from '../../context/alertContext';
import TitleReport from '../../components/TitleReport';


const Plazas = () => {
  const alert = useAlert();
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
    resultadosPesos: 1
  })

  useEffect(() => {
    if (validateInputDateRange(plazasParametros.fechaInicio, plazasParametros.fechaFin)) {
      getSemanalesPlazas(plazasParametros)
        .then(response => {
          if (isError(response)) {
            alert.showAlert(response?.response?.data ?? MENSAJE_ERROR, 'warning', 1000);
          } else {
            setSemanalesPlaza(response);
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazasParametros])

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputDateRange
            onChange={(e) => handleChange(e, setPlazasParametros)}
            beginDate={plazasParametros.fechaInicio}
            endDate={plazasParametros.fechaFin}
          />
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => handleChange(e, setPlazasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
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

      <TitleReport 
          title='Detalles de información / Semanales por plaza'
          description = {`Este reporte muestra un compartivo de la semana o en rango de fecha selecionado. Recuerde que la comparacion se realiza lunes contra lunes,
          lo cual quiere decir que las ventas del año anterior no seran por fecha sino lo que corresponda a los dias de la semana.
          `}
        />

      {/* Table */}
      <VentasTableContainer>
        <VentasTable className='tfooter'>
          <TableHead>
            <tr>
              <td rowSpan={3} className='border border-white'>Plaza</td>
              <td colSpan={12} className='border border-white'>{dateRangeTitle(plazasParametros.fechaInicio, plazasParametros.fechaFin)}</td>
            </tr>
            <tr>
              <td rowSpan={2} className='border border-white'>Comp</td>
              <td rowSpan={2} className='border border-white'>{getYearFromDate(plazasParametros.fechaFin)}</td>
              <td rowSpan={2} className='border border-white'>%</td>
              <td rowSpan={2} className='border border-white'>{getYearFromDate(plazasParametros.fechaFin) - 1}</td>
              <td colSpan={4} className='border border-white'>operaciones</td>
              <td colSpan={4} className='border border-white'>promedios</td>
            </tr>
            <tr>
              <td className='border border-white'>Comp</td>
              <td className='border border-white'>{getYearFromDate(plazasParametros.fechaFin)}</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>{getYearFromDate(plazasParametros.fechaFin) - 1}</td>
              <td className='border border-white'>comp</td>
              <td className='border border-white'>{getYearFromDate(plazasParametros.fechaFin)}</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>{getYearFromDate(plazasParametros.fechaFin) - 1}</td>
            </tr>
          </TableHead>
          <tbody className='bg-white text-center'>
            {
              semanalesPlaza?.map(semPlaza => (
                <TableRow key={semPlaza.plaza} rowId={semPlaza.plaza}>
                  <td className='text-left bg-black text-white font-bold'>
                    {semPlaza.plaza}
                  </td>
                  <td>{numberWithCommas(semPlaza.compromiso)}</td>
                  <td className='font-bold'>{numberWithCommas(semPlaza.ventasActuales)}</td>
                  {formatNumber(semPlaza.porcentaje)}
                  <td>{numberWithCommas(semPlaza.ventasAnterior)}</td>
                  <td className='font-bold'>{numberWithCommas(semPlaza.operacionesComp)}</td>
                  <td className='font-bold'>{numberWithCommas(semPlaza.operacionesActual)}</td>
                  {formatNumber(semPlaza.porcentajeOperaciones)}
                  <td>{numberWithCommas(semPlaza.operacionesAnterior)}</td>
                  <td className='font-bold'>{numberWithCommas(semPlaza.promedioComp)}</td>
                  <td className='font-bold'>{numberWithCommas(semPlaza.promedioActual)}</td>
                  {formatNumber(semPlaza.porcentajePromedios)}
                  <td>{numberWithCommas(semPlaza.promedioAnterior)}</td>
                </TableRow>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const PlazasWithAuth = withAuth(Plazas);
PlazasWithAuth.getLayout = getVentasLayout;
export default PlazasWithAuth;
