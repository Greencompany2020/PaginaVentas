import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer, InputYear, SelectMonth, Checkbox, SelectTiendasGeneral } from '../../components/inputs';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead } from '@components/table';
import { ventasDiariasGrupo, checkboxLabels } from 'utils/data';
import { useState } from 'react';

const grupo = () => {
  /* eslint-disable */
  const [parametrosConsulta, setParametrosConsulta] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tiendas: 0,
    conIva: 0,
    semanaSanta: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadoPesos: 0
  });

  const handleChange = (e) => {
    let value = 0;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked ? 1 : 0;
    } else {
      value = Number(e.target.value);
    }

    setParametrosConsulta({
      ...parametrosConsulta,
      [e.target.name]: value
    });

  }
  console.log(parametrosConsulta);
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth
              value={parametrosConsulta.delMes}
              onChange={handleChange}
            />
            <InputYear
              value={parametrosConsulta.delAgno}
              onChange={handleChange}
            />
            <SelectTiendasGeneral value={parametrosConsulta.tienda} onChange={handleChange} />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name="conIva"
              onChange={handleChange}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.SEMANA_SANTA}
              name="semanaSanta"
              checked={parametrosConsulta.semanaSanta ? true : false}
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
              name="resultadoPesos"
              onChange={handleChange}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla muestra las ventas del día por día del mes y año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Diarias Grupo Frogs'>
        <VentasTable>
          <VentasDiariasTableHead />
          <tbody className='bg-white text-right'>
            {
              ventasDiariasGrupo.map(item => (
                <tr key={item.fechaActual}>
                  <td className='text-center'>{item.fechaActual}</td>
                  <td className='text-center'>{item.fechaAnterior}</td>
                  <td>{item.ventaDiariaFechaActual}</td>
                  <td>{item.ventaDiariaFechaAnterior}</td>
                  <td>{item.ventaDiariaComp}</td>
                  <td>{item.ventaDiariaPor}</td>
                  <td>{item.acumuladoFechaActual}</td>
                  <td>{item.acumuladoFechaAnterior}</td>
                  <td>{item.acumuladoComp}</td>
                  <td>{item.diferenciaAcumulado}</td>
                  <td>{item.acumuladoPor}</td>
                  <td>{item.acumuladoAnualFechaActual}</td>
                  <td>{item.acumuladoAnualFechaAnterior}</td>
                  <td>{item.acumuladoAnualComp}</td>
                  <td>{item.acumuladoAnualPor}</td>
                  <td className='text-center'>{item.fechaActual}</td>
                </tr>
              ))
            }
          </tbody>
          <VentasDiariasTableFooter />
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default grupo
