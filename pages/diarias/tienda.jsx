import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead } from '../../components/table';
import { InputContainer, SelectMonth, InputYear, SelectTiendas, Checkbox } from '../../components/inputs';
import { checkboxLabels, tiendas } from '../../utils/data';
import { getDiariasTienda } from '../../services/DiariasServices';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import { getTiendaName } from '../../utils/functions';

const Tienda = () => {
  const initialTienda = tiendas.find((tienda => tienda.text === "M1")).value;

  const [diariasTienda, setDiariasTienda] = useState([]);
  const [tiendasParametros, setTiendaParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda: initialTienda,
    conIva: 0,
    semanaSanta: 1,
    resultadosPesos: 0
  });

  useEffect(() => {
    getDiariasTienda(tiendasParametros)
      .then(response => setDiariasTienda(response))
  }, [tiendasParametros]);

  const handleChange = (e) => {
    let value = 0;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked ? 1 : 0;
    } else if (e.target.name === "tienda") {
      value = e.target.value;
    } else {
      value = Number(e.target.value);
    }

    setTiendaParametros(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  }

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth
              value={tiendasParametros.delMes}
              onChange={handleChange}
            />
            <InputYear
              value={tiendasParametros.delAgno}
              onChange={handleChange}
            />
            <SelectTiendas
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
              className='mb-3'
              labelText={checkboxLabels.SEMANA_SANTA}
              name="semanaSanta"
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
          Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title={`Ventas Diarias ${getTiendaName(tiendasParametros.tienda)}`}>
        <VentasTable>
          <VentasDiariasTableHead currentYear={tiendasParametros.delAgno} month={tiendasParametros.delMes} />
          <tbody className='bg-white text-center'>
            {
              diariasTienda?.map((diaria) => (
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
          <VentasDiariasTableFooter currentYear={tiendasParametros.delAgno} month={tiendasParametros.delMes} />
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Tienda.getLayout = getVentasLayout;

export default Tienda
