import { useEffect, useState } from 'react';
import VentasLayout from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, VentasDiariasTableHead, VentasDiariasTableFooter } from '../../components/table';
import { InputContainer, SelectPlazas, SelectMonth, InputYear, Checkbox } from '../../components/inputs';
import { checkboxLabels, plazas } from '../../utils/data';
import { getDiariasPlazas } from '../../services/DiariasServices';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';

const Plaza = () => {
  const initialPlaza = plazas.find((plaza => plaza.text === "MAZATLAN")).value;

  const [diariasPlaza, setDiariasPlaza] = useState([]);
  const [plazaParametros, setPlazaParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    plaza: initialPlaza,
    conIva: 0,
    semanaSanta: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    getDiariasPlazas(plazaParametros)
      .then(response => setDiariasPlaza(response))
  }, [plazaParametros]);

  const handleChange = (e) => {
    let value = 0;
    if (e.target.hasOwnProperty('checked')) {
      value = e.target.checked ? 1 : 0;
    } else {
      value = Number(e.target.value);
    }

    setPlazaParametros(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  }

  const getPlazaName = (plazaId) => {
    const plaza = plazas.find((plaza) => plaza.value === plazaParametros.plaza);
    return plaza.text;
  }

  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas
              onChange={handleChange}
            />
            <SelectMonth
              value={plazaParametros.delMes}
              onChange={handleChange}
            />
            <InputYear
              value={plazaParametros.delAgno}
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
              checked={plazaParametros.semanaSanta ? true : false}
              name="semanaSanta"
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
              name="sinTiendaSuspendidas"
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

      <VentasTableContainer title={`Ventas Diarias Plaza ${getPlazaName(plazaParametros.plaza)}`}>
        <VentasTable>
          <VentasDiariasTableHead currentYear={plazaParametros.delAgno} month={plazaParametros.delMes} />
          <tbody className='bg-white text-center'>
            {
              diariasPlaza?.map((diaria) => (
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

export default Plaza
