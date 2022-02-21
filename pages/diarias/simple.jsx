import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { SelectTiendas, SelectMonth, InputYear, InputContainer, Checkbox } from '../../components/inputs';
import { checkboxLabels } from '../../utils/data';
import { getDiariasTiendaSimple } from '../../services/DiariasServices';
import { getInitialTienda, getLastTwoNumbers, getTiendaName } from '../../utils/functions';
import { numberWithCommas } from '../../utils/resultsFormated';
import { getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';

const Simple = () => {
  const [tiendaSimple, setTiendaSimple] = useState([]);
  const [tiendaSimpleParametros, setTiendaSimpleParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda: getInitialTienda(),
    conIva: 0,
  });

  useEffect(() => {
    getDiariasTiendaSimple(tiendaSimpleParametros)
      .then(response => setTiendaSimple(response))
  }, [tiendaSimpleParametros]);

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectTiendas onChange={(e) => handleChange(e, setTiendaSimpleParametros)} />
            <InputYear
              value={tiendaSimpleParametros.delAgno}
              onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
            />
            <SelectMonth
              value={tiendaSimpleParametros.delMes}
              onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
            />
            <Checkbox
              className='mb-2'
              labelText={checkboxLabels.VENTAS_IVA}
              name="conIva"
              onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer
        title={`Ventas Diarias ${getTiendaName(tiendaSimpleParametros.tienda)} ${getMonthByNumber(tiendaSimpleParametros.delMes)} ${tiendaSimpleParametros.delAgno}`}
      >
        <VentasTable>
          <TableHead>
            <tr>
              <th colSpan={2} className='border border-white'>Dia</th>
              <th colSpan={3} className='border border-white'>Venta por Dia</th>
            </tr>
            <tr>
              <th className='border border-white'>{getLastTwoNumbers(tiendaSimpleParametros.delAgno)}</th>
              <th className='border border-white'>{getLastTwoNumbers(tiendaSimpleParametros.delAgno - 1)}</th>
              <th className='border border-white'>{tiendaSimpleParametros.delAgno}</th>
              <th className='border border-white'>{tiendaSimpleParametros.delAgno - 1}</th>
              <th className='border border-white'>Acum</th>
            </tr>
          </TableHead>
          <tbody className='bg-white text-center'>
            {
              tiendaSimple?.map(ventas => (
                <tr key={ventas.dia}>
                  <td>{ventas.dia}</td>
                  <td>{ventas.dia}</td>
                  <td>{numberWithCommas(ventas.ventaActual)}</td>
                  <td>{numberWithCommas(ventas.ventaAnterior)}</td>
                  <td>{numberWithCommas(ventas.acumulado)}</td>
                </tr>
              ))
            }
          </tbody>
          <tfoot className='bg-black text-white text-center font-bold'>
            <tr>
              <th className='border border-white'>{getLastTwoNumbers(tiendaSimpleParametros.delAgno)}</th>
              <th className='border border-white'>{getLastTwoNumbers(tiendaSimpleParametros.delAgno - 1)}</th>
              <th className='border border-white'>{tiendaSimpleParametros.delAgno}</th>
              <th className='border border-white'>{tiendaSimpleParametros.delAgno - 1}</th>
              <th className='border border-white'>Acum</th>
            </tr>
            <tr>
              <th colSpan={2} className='border border-white'>Dia</th>
              <th colSpan={3} className='border border-white'>Venta por Dia</th>
            </tr>
          </tfoot>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Simple.getLayout = getVentasLayout;

export default Simple
