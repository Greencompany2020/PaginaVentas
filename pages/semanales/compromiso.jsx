import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, InputDateRange, SelectPlazas, Checkbox } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { checkboxLabels } from '../../utils/data';
import { getSemanalesCompromisos } from '../../services/SemanalesService';
import { numberWithCommas } from '../../utils/resultsFormated';
import { getCurrentWeekDateRange } from '../../utils/dateFunctions';
import { dateRangeTitle, validateInputDateRange } from '../../utils/functions';
import { inputNames } from '../../utils/data/checkboxLabels';
import { handleChange } from '../../utils/handlers';

const Compromiso = () => {
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [semanalesCompromisos, setSemanalesCompromisos] = useState([]);
  const [compromisosParametros, setCompromisosParametros] = useState({
    fechaInicio: beginDate,
    fechaFin: endDate,
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

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas
              classLabel='xl:text-center'
              onChange={(e) => handleChange(e, setCompromisosParametros)}
            />
          </InputContainer>
          <InputDateRange
            onChange={(e) => handleChange(e, setCompromisosParametros)}
            beginDate={compromisosParametros.fechaInicio}
            endDate={compromisosParametros.fechaFin}
          />
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setCompromisosParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setCompromisosParametros)}
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

      <VentasTableContainer title={`DEFINICION METAS: Semana ${dateRangeTitle(compromisosParametros.fechaInicio, compromisosParametros.fechaFin)}`}>
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
