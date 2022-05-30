import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, VentasDiariasTableHead, VentasDiariasTableFooter, TableRow } from '../../components/table';
import { InputContainer, SelectPlazas, SelectMonth, InputYear, Checkbox } from '../../components/inputs';
import { checkboxLabels, MENSAJE_ERROR } from '../../utils/data';
import { getDiariasPlazas } from '../../services/DiariasServices';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import { getInitialPlaza, getPlazaName, isError } from '../../utils/functions';
import { inputNames } from '../../utils/data/checkboxLabels';
import { handleChange } from '../../utils/handlers';
import withAuth from '../../components/withAuth';
import { useUser } from '../../context/UserContext';
import {useAlert} from '../../context/alertContext';
import TitleReport from '../../components/TitleReport';


const Plaza = () => {
  const alert = useAlert();
  const { plazas } = useUser();
  const [diariasPlaza, setDiariasPlaza] = useState([]);
  const [plazaParametros, setPlazaParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    plaza: getInitialPlaza(plazas),
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
      .then(response => {
        if (isError(response)) {
          alert.showAlert(response?.response?.data ?? MENSAJE_ERROR, 'warning', 1000);
        } else {
          setDiariasPlaza(response)
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazaParametros]);

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas
              onChange={(e) => handleChange(e, setPlazaParametros)}
              value={plazaParametros.plaza}
            />
            <SelectMonth
              value={plazaParametros.delMes}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
            <InputYear
              value={plazaParametros.delAgno}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.SEMANA_SANTA}
              checked={plazaParametros.semanaSanta ? true : false}
              name={inputNames.SEMANA_SANTA}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setPlazaParametros)}
            />
          </InputContainer>
        </Parameters>
      </ParametersContainer>

      <TitleReport 
          title={`Ventas Diarias Plaza ${getPlazaName(plazaParametros.plaza)}`}
          description = ' Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior.'
      />

      <VentasTableContainer>
        <VentasTable>
          <VentasDiariasTableHead currentYear={plazaParametros.delAgno} month={plazaParametros.delMes} />
          <tbody className='bg-white text-center'>
            {
              diariasPlaza?.map((diaria) => (
                <TableRow key={diaria.dia} rowId={diaria.dia}>
                  <td className='text-center font-bold'>{diaria.dia}</td>
                  <td className='text-center'>{diaria.dia}</td>
                  <td className='font-bold'>{numberWithCommas(diaria.ventaActual)}</td>
                  <td>{numberWithCommas(diaria.ventaAnterior)}</td>
                  <td>{numberWithCommas(diaria.compromisoDiario)}</td>
                  {formatNumber(diaria.crecimientoDiario)}
                  <td className='font-bold'>{numberWithCommas(diaria.acumMensualActual)}</td>
                  <td>{numberWithCommas(diaria.acumMensualAnterior)}</td>
                  <td>{numberWithCommas(diaria.compromisoAcum)}</td>
                  {formatNumber(diaria.diferencia)}
                  {formatNumber(diaria.crecimientoMensual)}
                  <td className='font-bold'>{numberWithCommas(diaria.acumAnualActual)}</td>
                  <td>{numberWithCommas(diaria.acumAnualAnterior)}</td>
                  <td>{numberWithCommas(diaria.compromisoAnual)}</td>
                  {formatNumber(diaria.crecimientoAnual)}
                  <td className='text-center font-bold'>{diaria.dia}</td>
                </TableRow>
              ))
            }
          </tbody>
          <VentasDiariasTableFooter currentYear={plazaParametros.delAgno} month={plazaParametros.delMes} />
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}


const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth
