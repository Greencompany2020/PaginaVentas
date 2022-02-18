import { useState, useEffect } from 'react';
import { format, previousMonday, nextSunday } from 'date-fns';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, InputDateRange, SelectPlazas, Checkbox } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { checkboxLabels } from '../../utils/data';
import { getSemanalesCompromisos } from '../../services/SemanalesService';
import { getMonth } from '../../utils/functions';
import { numberWithCommas } from '../../utils/resultsFormated';

const Compromiso = () => {
  const [semanalesCompromisos, setSemanalesCompromisos] = useState([]);
  const [compromisosParametros, setCompromisosParametros] = useState({
    fechaInicio: format(previousMonday(new Date(Date.now())), "yyyy-MM-dd", { weekStartsOn: 1 }),
    fechaFin: format(nextSunday(new Date(Date.now())), "yyyy-MM-dd", { weekStartsOn: 1 }),
    plaza: 3,
    conIva: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0
  });

  useEffect(() => {
    if (validateInputDateRange(compromisosParametros.fechaInicio, compromisosParametros.fechaFin)) {
      getSemanalesCompromisos(compromisosParametros)
        .then(response => setSemanalesCompromisos(response));
    }
  }, [compromisosParametros]);

  const validateInputDateRange = (beginDate, endDate) => (beginDate?.length === 10 && endDate?.length === 10)

  const handleChange = (e) => {
    let value = 0;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked ? 1 : 0;
    } else if (e.target.type === "date") {
      value = e.target.value;
    } else {
      value = Number(e.target.value);
    }

    setCompromisosParametros(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  }

  const getMonthChars = (month) => month?.slice(0, 3);

  const dateRangeTitle = (beginDate, endDate) => {
    let beginTextDate = "";
    let endTextDate = "";

    let beginDateParts = beginDate.split("-");
    let endDateParts = endDate.split("-");

    let beginMonth = getMonth(beginDateParts[1]);
    beginMonth = getMonthChars(beginMonth);

    let endMonth = getMonth(endDateParts[1]);
    endMonth = getMonthChars(endMonth);

    beginTextDate = `${beginDateParts[2]} de ${beginMonth} del ${beginDateParts[0]}`;
    endTextDate = `${endDateParts[2]} de ${endMonth} del ${endDateParts[0]}`;

    return `Semana del ${beginTextDate} Al ${endTextDate}`;
  }

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas
              classLabel='xl:text-center'
              onChange={handleChange}
            />
          </InputContainer>
          <InputDateRange
            onChange={handleChange}
            beginDate={compromisosParametros.fechaInicio}
            endDate={compromisosParametros.fechaFin}
          />
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name="conIva"
              onChange={handleChange}
            />
            <Checkbox
              labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS}
              name="sinAgnoVenta"
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name="conTiendasCerradas"
              onChange={handleChange}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este informe muestra un compartivo de la semana o en rango de fecha selecionado. Recuerde que la comparaciones se realiza lunes contra lunes,
        </SmallContainer>
        <SmallContainer>
          lo cual quiere decir que las ventas del año anterior no seran por fecha sino lo que corresponda a los dias de la semana.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title={`DEFINICION METAS: ${dateRangeTitle(compromisosParametros.fechaInicio, compromisosParametros.fechaFin)}`}>
        <VentasTable>
          <TableHead>
            <tr>
              <th rowSpan={2} className='border border-white'>Tienda</th>
              <th colSpan={2} className='border border-white'>Venta</th>
              <th colSpan={2} className='border border-white'>Promedios</th>
              <th colSpan={2} className='border border-white'>Operaciones</th>
            </tr>
            <tr>
              <th colSpan={2} className='border border-white'>Compromiso</th>
              <th colSpan={2} className='border border-white'>Comp</th>
              <th colSpan={2} className='border border-white'>Comp</th>
            </tr>
          </TableHead>
          <tbody className='bg-white'>
            {
              semanalesCompromisos?.map(compromiso => (
                <tr key={compromiso.Descrip} className='text-right'>
                  <td colSpan={2} className='text-center bg-black text-white font-bold p-2'>
                    {compromiso.Descrip}
                  </td>
                  <td>{numberWithCommas(compromiso.PresupuestoSem)}</td>
                  <td colSpan={2} className='pr-4'>
                    <input
                      type="text"
                      value={compromiso.Promedio}
                      className='w-16 outline-none bg-gray-200 text-right rounded-md pr-2'
                      onChange={() => { }}
                    />
                  </td>
                  <td colSpan={2} className='pr-4'>
                    <input
                      type="text"
                      value={compromiso.OperacionesSem}
                      className='w-16 outline-none bg-gray-200 text-right rounded-md pr-2'
                      onChange={() => { }}
                    />
                  </td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
      <button className='blue-button text-white'>
        Grabar
      </button>
    </>
  )
}

Compromiso.getLayout = getVentasLayout;

export default Compromiso;
