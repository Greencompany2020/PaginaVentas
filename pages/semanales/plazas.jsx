import { format, nextSunday, previousMonday } from 'date-fns';
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { SmallContainer, ParametersContainer, Parameters } from '../../components/containers';
import { InputContainer, InputDateRange, Checkbox } from '../../components/inputs'
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { getSemanalesPlazas } from '../../services/SemanalesService';
import { checkboxLabels } from '../../utils/data'
import { dateRangeTitle, getYearFromDate, validateInputDateRange } from '../../utils/functions';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';


const Plazas = () => {
  const [semanalesPlaza, setSemanalesPlaza] = useState([]);
  const [plazasParametros, setPlazasParametros] = useState({
    fechaInicio: format(previousMonday(new Date(Date.now())), "yyyy-MM-dd", { weekStartsOn: 1 }),
    fechaFin: format(nextSunday(new Date(Date.now())), "yyyy-MM-dd", { weekStartsOn: 1 }),
    conIva: 0,
    sinAgnoVenta: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 1
  })

  useEffect(() => {
    if (validateInputDateRange(plazasParametros.fechaInicio, plazasParametros.fechaInicio)) {
      getSemanalesPlazas(plazasParametros)
        .then(response => setSemanalesPlaza(response));
    }
  }, [plazasParametros])

  const handleChange = (e) => {
    let value = 0;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked ? 1 : 0;
    } else if (e.target.type === "date") {
      value = e.target.value;
    } else {
      value = Number(e.target.value);
    }

    setPlazasParametros(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  }

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputDateRange
            onChange={handleChange}
            beginDate={plazasParametros.fechaInicio}
            endDate={plazasParametros.fechaFin}
          />
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name="conIva"
              onChange={handleChange}
            />
            <Checkbox
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name="conVentasEventos"
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name="conTiendasCerradas"
            />
            <Checkbox
              labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS}
              name="sinAgnoVenta"
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name="sinTiendasSuspendidas"
              onChange={handleChange}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name="resultadosPesos"
              checked={plazasParametros.resultadosPesos ? 1 : 0}
              onChange={handleChange}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este informe muestra un compartivo de la semana o en rango de fecha selecionado. Recuerde que la comparacions se realiza lunes contra lunes,
        </SmallContainer>
        <SmallContainer>
          lo cual quiere decir que las ventas del año anterior no seran por fecha sino lo que corresponda a los dias de la semana.
        </SmallContainer>
      </ParametersContainer>

      {/* Table */}
      <VentasTableContainer title='Detalles de información / Semanales por plaza'>
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
              <td className='border border-white'>2021</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>2020</td>
              <td className='border border-white'>comp</td>
              <td className='border border-white'>2021</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>2020</td>
            </tr>
          </TableHead>
          <tbody className='bg-white text-center'>
            {
              semanalesPlaza?.map(semPlaza => (
                <tr key={semPlaza.plaza}>
                  <td className='text-left bg-black text-white underline font-bold'>
                    <Link href='#'><a>{semPlaza.plaza}</a></Link>
                  </td>
                  <td>{numberWithCommas(semPlaza.compromiso)}</td>
                  <td>{numberWithCommas(semPlaza.ventasActuales)}</td>
                  {formatNumber(semPlaza.porcentaje)}
                  <td>{numberWithCommas(semPlaza.ventasAnterior)}</td>
                  <td>{numberWithCommas(semPlaza.operacionesComp)}</td>
                  <td>{numberWithCommas(semPlaza.operacionesActual)}</td>
                  {formatNumber(semPlaza.porcentajeOperaciones)}
                  <td>{numberWithCommas(semPlaza.operacionesAnterior)}</td>
                  <td>{numberWithCommas(semPlaza.promedioComp)}</td>
                  <td>{numberWithCommas(semPlaza.promedioActual)}</td>
                  {formatNumber(semPlaza.porcentajePromedios)}
                  <td>{numberWithCommas(semPlaza.promedioAnterior)}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Plazas.getLayout = getVentasLayout;

export default Plazas
