import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import BarChart from '../../components/BarChart';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectMonth, SelectTiendasGeneral, InputYear, Checkbox, InputToYear, SelectToMonth } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { MessageModal } from '../../components/modals';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import { formatLastDate, getCurrentMonth, getCurrentYear, getPrevDate } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getMesesAgnosGrupo } from '../../services/MesesAgnosService';
import useGraphData from '../../hooks/useGraphData';
import useMessageModal from "../../hooks/useMessageModal";
import { createMesesAgnosGrupoDataset, isError, validateMonthRange, validateYearRange } from '../../utils/functions';
import withAuth from '../../components/withAuth';

const Grupo = () => {
  const { labels, setLabels, datasets, setDatasets } = useGraphData();
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [parametrosGrupo, setParametrosGrupo] = useState({
    delAgno: getCurrentYear() - 5,
    alAgno: getCurrentYear(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    tiendas: 0,
    incluirTotal: 0,
    ventasDiaMesActual: 0,
    conIva: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 0
  });

  useEffect(() => {
    if (validateYearRange(parametrosGrupo.delAgno, parametrosGrupo.alAgno) && validateMonthRange(parametrosGrupo.delMes, parametrosGrupo.alMes)) {
      getMesesAgnosGrupo(parametrosGrupo)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createMesesAgnosGrupoDataset(
                response,
                parametrosGrupo.delAgno,
                parametrosGrupo.alAgno,
                setDatasets,
                setLabels
              )
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosGrupo]);
  
  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear
              value={parametrosGrupo.delAgno}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <InputToYear
              value={parametrosGrupo.alAgno}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <SelectMonth
              value={parametrosGrupo.delMes}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <SelectToMonth
              value={parametrosGrupo.alMes}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <SelectTiendasGeneral />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TOTAL}
              name={inputNames.INCLUIR_TOTAL}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
              name={inputNames.VENTAS_DIA_MES_ACTUAL}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta gr??fica muestra las ventas anuales del grupo para cada uno de los a??os del rango especificado.
        </SmallContainer>
        <SmallContainer>
          Recuerde que el rango de a??os debe ser capturado de el menor a el mayor aunque en el reporte se mostrar?? en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title={`Comparativo de ventas del a??o ${parametrosGrupo.delAgno} al a??o ${parametrosGrupo.alAgno} (mls.dlls)`}>
        <BarChart
          text={`${parametrosGrupo.alMes === getCurrentMonth() ? `Ventas al ${formatLastDate(getPrevDate(0, parametrosGrupo.alAgno))}` : ""}`}
          data={{
            labels,
            datasets
          }}
        />
      </ComparativoVentas>
    </>
  )
}


const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
