import Link from 'next/link';
import { useState, useEffect } from 'react';
import { SmallContainer, ParametersContainer, Parameters } from '../../components/containers';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { InputContainer, InputDateRange, Checkbox, SelectTiendasGeneral } from '../../components/inputs';
import { regiones, checkboxLabels, plazas } from '../../utils/data';
import { getCurrentWeekDateRange, getYearFromDate } from '../../utils/dateFunctions';
import { dateRangeTitle, validateInputDateRange } from '../../utils/functions';
import { getSemanalesTiendas } from '../../services/SemanalesService';
import RegionesPlazaTableRow from '../../components/table/RegionesPlazaTableRow';

const Tiendas = () => {
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
        .then(response => setSemanalesTienda(response))
    }
  }, [tiendasParametros]);

  const handleChange = (e) => {
    let value = 0;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked ? 1 : 0;
    } else if (e.target.type === "date") {
      value = e.target.value;
    } else {
      value = Number(e.target.value);
    }

    setTiendasParametros(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  }

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
      <ParametersContainer>
        <Parameters>
          <InputDateRange
            beginDate={tiendasParametros.fechaInicio}
            endDate={tiendasParametros.fechaFin}
            onChange={handleChange}
          />
          <InputContainer>
            <SelectTiendasGeneral
              value={tiendasParametros.tiendas}
              onChange={handleChange}
            />
          </InputContainer>
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
              onChange={handleChange}
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
