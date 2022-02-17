import { useEffect, useState } from 'react';
import VentasLayout from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, InputYear, SelectMonth, Checkbox, SelectTiendasGeneral } from '../../components/inputs';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead } from '../../components/table';
import { checkboxLabels } from '../../utils/data';
import { getDiariasGrupo } from '../../services/DiariasServices';

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
    resultadosPesos: 0
  });

  const [diariasGrupo, setDiariasGrupo] = useState([]);

  useEffect(() => {
    if (parametrosConsulta.delAgno.toString().length === 4) {
      getDiariasGrupo(parametrosConsulta)
        .then(response => setDiariasGrupo(response))
        .catch(error => console.log(error))
    }

  }, [parametrosConsulta]);

  const handleChange = (e) => {
    let value = 0;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked ? 1 : 0;
    } else {
      value = Number(e.target.value);
    }

    setParametrosConsulta(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  }

  const formatNumber = (num) => {
    let numberText = "";
    if (num <= 0) {
      numberText = `(${Math.abs(num)})`;
      return (<td className='text-red-900 font-bold'>{numberText}</td>)
    } else {
      numberText = `${Math.abs(num)}`;
      return (<td className='text-green-900 font-bold'>{numberText}</td>)
    }
  }

  const numberWithCommas = (num) => {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

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
              name="resultadosPesos"
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
          <VentasDiariasTableHead currentYear={parametrosConsulta.delAgno} month={parametrosConsulta.delMes} />
          <tbody className='bg-white text-center'>
            {
              diariasGrupo?.map((diaria) => (
                <tr key={diaria.dia} className='p-1'>
                  <td className='text-center'>{diaria.dia}</td>
                  <td className='text-center'>{diaria.dia}</td>
                  <td>{numberWithCommas(diaria.ventaActual)}</td>
                  <td>{numberWithCommas(diaria.ventaAnterior)}</td>
                  <td>{numberWithCommas(diaria.compromisoDiario)}</td>
                  {formatNumber(diaria.crecimientoDiario)}
                  <td>{numberWithCommas(diaria.acumMensualActual)}</td>
                  <td>{numberWithCommas(diaria.acumMensualAnterior)}</td>
                  <td>{numberWithCommas(diaria.compromisoAcum)}</td>
                  {formatNumber(diaria.diferencia)}
                  {formatNumber(diaria.crecimientoMensual)}
                  <td>{numberWithCommas(diaria.acumAnualActual)}</td>
                  <td>{numberWithCommas(diaria.acumAnualAnterior)}</td>
                  <td>{numberWithCommas(diaria.compromisoAnual)}</td>
                  {formatNumber(diaria.crecimientoAnual)}
                  <td className='text-center'>{diaria.dia}</td>
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
