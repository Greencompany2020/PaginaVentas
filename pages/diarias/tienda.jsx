import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead, TableRow } from '../../components/table';
import { InputContainer, SelectMonth, InputYear, SelectTiendas, Checkbox } from '../../components/inputs';
import { checkboxLabels, MENSAJE_ERROR } from '../../utils/data';
import { getDiariasTienda } from '../../services/DiariasServices';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import { getInitialTienda, getTiendaName, isError } from '../../utils/functions';
import { handleChange } from '../../utils/handlers';
import withAuth from '../../components/withAuth';
import { useUser } from '../../context/UserContext';
import {useAlert} from '../../context/alertContext';
import TitleReport from '../../components/TitleReport';


const Tienda = () => {
  const alert = useAlert();
  const { tiendas } = useUser();
  const [diariasTienda, setDiariasTienda] = useState([]);
  const [tiendasParametros, setTiendaParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda: getInitialTienda(tiendas),
    conIva: 0,
    semanaSanta: 1,
    resultadosPesos: 0
  });

  useEffect(() => {
    getDiariasTienda(tiendasParametros)
      .then(response => {
        if (isError(response)) {
          alert.showAlert(response?.response?.data ?? MENSAJE_ERROR, 'warning', 1000);
        } else {
          setDiariasTienda(response);
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros]);

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth
              value={tiendasParametros.delMes}
              onChange={(e) => handleChange(e, setTiendaParametros)}
            />
            <InputYear
              value={tiendasParametros.delAgno}
              onChange={(e) => handleChange(e, setTiendaParametros)}
            />
            <SelectTiendas
              value={tiendasParametros.tienda}
              onChange={(e) => handleChange(e, setTiendaParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name="conIva"
              onChange={(e) => handleChange(e, setTiendaParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.SEMANA_SANTA}
              name="semanaSanta"
              onChange={(e) => handleChange(e, setTiendaParametros)}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name="resultadosPesos"
              onChange={(e) => handleChange(e, setTiendaParametros)}
            />
          </InputContainer>
        </Parameters>
      </ParametersContainer>

      <TitleReport 
        title={`Ventas Diarias ${getTiendaName(tiendasParametros.tienda)}`}
        description = 'Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior.'
      />

      <VentasTableContainer>
        <VentasTable>
          <VentasDiariasTableHead currentYear={tiendasParametros.delAgno} month={tiendasParametros.delMes} />
          <tbody className='bg-white text-center'>
            {
              diariasTienda?.map((diaria) => (
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
          <VentasDiariasTableFooter currentYear={tiendasParametros.delAgno} month={tiendasParametros.delMes} />
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
