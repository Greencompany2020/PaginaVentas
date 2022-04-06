import { useState, useEffect } from 'react';
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectPlazas,
  InputDateRange,
} from "../../components/inputs";
import { VentasTableContainer } from "../../components/table";
import { PresupuestoTable } from "../../components/table";
import MessageModal from '../../components/MessageModal';
import { handleChange } from '../../utils/handlers'
import { getInitialPlaza, getPlazaName, validateInputDateRange } from '../../utils/functions';
import { formatLastDate, getBeginEndMonth } from '../../utils/dateFunctions';
import { getPresupuestoFechas } from '../../services/PresupuestoService';
import useMessageModal from '../../hooks/useMessageModal';
import { MENSAJE_ERROR } from '../../utils/data';

const Fechas = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [prespuestos, setPrespuestos] = useState({});
  const [paramFechas, setParamFechas] = useState({
    plaza: getInitialPlaza(),
    fechaInicio: getBeginEndMonth()[0],
    fechaFin: getBeginEndMonth()[1],
  });

  useEffect(() => {
    if (validateInputDateRange(paramFechas.fechaInicio, paramFechas.fechaFin)) {
      getPresupuestoFechas(paramFechas)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setPrespuestos(response)
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFechas]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas 
              onChange={(e) => { handleChange(e, setParamFechas) }}
            />
            <InputDateRange 
              beginDate={paramFechas.fechaInicio}
              endDate={paramFechas.fechaFin}
              onChange={(e) => { handleChange(e, setParamFechas) }}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          ESTE REPORTE OBTIENE EL COMPROMISO DE VENTAS PARA CIERTO RANGO DE FECHAS,
        </SmallContainer>
        <SmallContainer>
          QUE PUEDE SER UN MES, UNA SEMANA, UN FIN DE SEMANA, BASADO EN LA FECHAS ESTABLECIDA...
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer 
        title={`Compromisos plaza ${getPlazaName(paramFechas.plaza)} del ${formatLastDate(paramFechas.fechaInicio)} al ${formatLastDate(paramFechas.fechaFin)}`}
      >
      {
        Object.entries(prespuestos).map(([key, value]) => (
          <PresupuestoTable key={key} title={key} presupuestos={value} />
        ))
      }
      </VentasTableContainer>
    </>
  );
};

Fechas.getLayout = getVentasLayout;

export default Fechas;
