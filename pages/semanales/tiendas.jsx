import { useState, useEffect } from 'react';
import { SmallContainer, ParametersContainer, Parameters } from '../../components/containers';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { InputContainer, InputDateRange, Checkbox, SelectTiendasGeneral } from '../../components/inputs';
import MessageModal from '../../components/MessageModal';
import RegionesPlazaTableRow from '../../components/table/RegionesPlazaTableRow';
import { regiones, checkboxLabels, plazas, MENSAJE_ERROR } from '../../utils/data';
import { getCurrentWeekDateRange, getYearFromDate } from '../../utils/dateFunctions';
import { dateRangeTitle, isError, validateInputDateRange } from '../../utils/functions';
import { getSemanalesTiendas } from '../../services/SemanalesService';
import { inputNames } from '../../utils/data/checkboxLabels';
import { handleChange } from '../../utils/handlers';
import useMessageModal from '../../hooks/useMessageModal';

const Tiendas = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [semanalesTienda, setSemanalesTienda] = useState([]);
  const [tiendasParametros, setTiendasParametros] = useState({
    fechaInicio: beginDate,
    fechaFin: endDate,
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateInputDateRange(tiendasParametros.fechaInicio, tiendasParametros.fechaFin)) {
      getSemanalesTiendas(tiendasParametros)
        .then(response => {
          if (isError(response)) {
            setMessage(response?.response?.data ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setSemanalesTienda(response)
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros]);


  const renderRow = (item) => {
    if (plazas.findIndex(plaza => plaza.text === item.plaza) !== -1) {
      return (<RegionesPlazaTableRow item={item} type="plaza" key={item.plaza} />)
    }
    if (regiones.includes(item.plaza)) {
      return (<RegionesPlazaTableRow item={item} type="region" key={item.plaza} />)
    }
    return (<RegionesPlazaTableRow item={item} key={item.plaza} />)
  }

  return (
    <>
      <MessageModal message={message} setShowModal={setModalOpen} showModal={modalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputDateRange
            beginDate={tiendasParametros.fechaInicio}
            endDate={tiendasParametros.fechaFin}
            onChange={(e) => handleChange(e, setTiendasParametros)}
          />
          <InputContainer>
            <SelectTiendasGeneral
              value={tiendasParametros.tiendas}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setTiendasParametros)}
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

      <VentasTableContainer title="Detalles de información / Semanales por Tienda">
        <VentasTable className='tfooter'>
          <TableHead>
            <tr>
              <td rowSpan={3} className='border border-white'>Plaza</td>
              <td colSpan={15} className='border border-white'>{dateRangeTitle(tiendasParametros.fechaInicio, tiendasParametros.fechaFin)}</td>
            </tr>
            <tr>
              <td rowSpan={2} className='border border-white'>Comp</td>
              <td rowSpan={2} className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin)}</td>
              <td rowSpan={2} className='border border-white'>%</td>
              <td rowSpan={2} className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin) - 1}</td>
              <td colSpan={4} className='border border-white'>operaciones</td>
              <td colSpan={4} className='border border-white'>promedios</td>
              <td colSpan={3} className='border border-white'>Articulos Prom.</td>
            </tr>
            <tr>
              <td className='border border-white'>Comp</td>
              <td className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin)}</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin) - 1}</td>
              <td className='border border-white'>comp</td>
              <td className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin)}</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin) - 1}</td>
              <td className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin)}</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>{getYearFromDate(tiendasParametros.fechaFin) - 1}</td>
            </tr>
          </TableHead>
          <tbody className='bg-white text-center'>
            {
              semanalesTienda?.map(tienda => renderRow(tienda))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Tiendas.getLayout = getVentasLayout;

export default Tiendas
