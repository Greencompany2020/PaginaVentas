import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead } from '../../components/table';
import { InputContainer, SelectMonth, InputYear, SelectTiendas, Checkbox } from '../../components/inputs';
import { MessageModal } from '../../components/modals';
import { checkboxLabels, MENSAJE_ERROR } from '../../utils/data';
import { getDiariasTienda } from '../../services/DiariasServices';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import { getInitialTienda, getTiendaName, isError } from '../../utils/functions';
import { handleChange } from '../../utils/handlers';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';

const Tienda = () => {
  const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();
  const [diariasTienda, setDiariasTienda] = useState([]);
  const [tiendasParametros, setTiendaParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda:'none',
    conIva: 0,
    semanaSanta: 1,
    resultadosPesos: 0
  });

  useEffect(() => {
    getDiariasTienda(tiendasParametros)
      .then(response => {
        if (isError(response)) {
          setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
          setModalOpen(true);
        } else {
          setDiariasTienda(response);
        }
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros]);

  return (
    <>
      <MessageModal message={message} setModalOpen={setModalOpen} modalOpen={modalOpen} />
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
        <SmallContainer>
          Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y a??o especificado, este siempre ser?? comparado contra el a??o anterior.
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

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
