import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, InputDateRange, InputRangos, SelectTiendas, } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { MessageModal } from '../../components/modals';
import PieChart from '../../components/Pie';
import { createRangoVentasDataset, getInitialTienda, isError, validateInputDateRange } from '../../utils/functions';
import { getBeginEndMonth } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getRangoVentasTienda } from '../../services/RangoVentasService';
import useGraphData from '../../hooks/useGraphData';
import useMessageModal from '../../hooks/useMessageModal';
import { MENSAJE_ERROR } from '../../utils/data';
import withAuth from '../../components/withAuth';
import { useUser } from '../../context/UserContext';

const Tienda = () => {
  const { tiendas } = useUser();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(tiendas),
    fechaInicio: getBeginEndMonth(true)[0],
    fechaFin: getBeginEndMonth(true)[1],
    rangos: '100,200,300,400,500,600'
  });

  useEffect(() => {
    if (validateInputDateRange(paramTienda.fechaInicio, paramTienda.fechaFin)) {
      getRangoVentasTienda(paramTienda)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createRangoVentasDataset(response, setLabels, setDatasets)
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda]);
  
  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectTiendas
              value={paramTienda.tienda}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <h1>Obtener Rangos de Ventas de las fechas:</h1>
            <InputDateRange 
              beginDate={paramTienda.fechaInicio}
              endDate={paramTienda.fechaFin}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <InputRangos 
              value={paramTienda.rangos}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
          </InputContainer>
        </Parameters> 
        <SmallContainer>
          ESTE REPORTE OBTIENE LOS RANGOS DE VENTA, DE LAS FECHAS ESTABLECIDAS. EL RANGO ESTABLEZCALO
        </SmallContainer>
        <SmallContainer>
          DE LA FORMA 1,150,250,350,400 QUE INDICA P.E. DEL 1 AL 149.00 DEL 150 AL 249.99.
        </SmallContainer>
      </ParametersContainer>

      <ComparativoVentas title='Rangos de ventas por Tienda'>
        <PieChart
          data={{
            labels,
            datasets
          }}
        />
      </ComparativoVentas>
    </>
  )
}

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
