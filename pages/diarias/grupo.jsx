import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, InputYear, SelectMonth, Checkbox, SelectTiendasGeneral } from '../../components/inputs';
import { MessageModal } from '../../components/modals';
import { VentasTableContainer, VentasTable, VentasDiariasTableFooter, VentasDiariasTableHead } from '../../components/table';
import { checkboxLabels, MENSAJE_ERROR } from '../../utils/data';
import { getDiariasGrupo } from '../../services/DiariasServices';
import { formatNumber, numberWithCommas } from '../../utils/resultsFormated';
import { inputNames } from '../../utils/data/checkboxLabels';
import { handleChange } from '../../utils/handlers';
import useMessageModal from '../../hooks/useMessageModal';
import { isError } from '../../utils/functions';
import withAuth from '../../components/withAuth';

const Grupo = () => {
  const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();
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
        .then(response => {
          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setDiariasGrupo(response);
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosConsulta]);

  return (
    <>
      <MessageModal message={message} setModalOpen={setModalOpen} modalOpen={modalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth
              value={parametrosConsulta.delMes}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
            <InputYear
              value={parametrosConsulta.delAgno}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
            <SelectTiendasGeneral value={parametrosConsulta.tienda} onChange={(e) => handleChange(e, setParametrosConsulta)} />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.SEMANA_SANTA}
              name={inputNames.SEMANA_SANTA}
              checked={parametrosConsulta.semanaSanta ? true : false}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
            <Checkbox
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
            <Checkbox
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setParametrosConsulta)}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla muestra las ventas del d??a por d??a del mes y a??o especificado.
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
          <VentasDiariasTableFooter currentYear={parametrosConsulta.delAgno} month={parametrosConsulta.delMes} />
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
