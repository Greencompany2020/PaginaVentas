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
import { handleChange } from '../../utils/handlers'
import { getInitialPlaza, getPlazaName, isError, validateInputDateRange } from '../../utils/functions';
import { formatLastDate, getBeginEndMonth } from '../../utils/dateFunctions';
import { getPresupuestoFechas } from '../../services/PresupuestoService';
import { MENSAJE_ERROR } from '../../utils/data';
import withAuth from '../../components/withAuth';
import { useUser } from '../../context/UserContext';
import {useAlert} from '../../context/alertContext';
import TitleReport from '../../components/TitleReport';


const Fechas = () => {
  const alert = useAlert();
  const { plazas } = useUser();
  const [prespuestos, setPrespuestos] = useState({});
  const [paramFechas, setParamFechas] = useState({
    plaza: getInitialPlaza(plazas),
    fechaInicio: getBeginEndMonth()[0],
    fechaFin: getBeginEndMonth()[1],
  });

  useEffect(() => {
    if (validateInputDateRange(paramFechas.fechaInicio, paramFechas.fechaFin)) {
      getPresupuestoFechas(paramFechas)
        .then(response => {

          if (isError(response)) {
            alert.showAlert(response?.response?.data ?? MENSAJE_ERROR, 'warning', 1000);
          } else {
            setPrespuestos(response)
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFechas]);

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas
              value={paramFechas.plaza}
              onChange={(e) => { handleChange(e, setParamFechas) }}
            />
            <InputDateRange 
              beginDate={paramFechas.fechaInicio}
              endDate={paramFechas.fechaFin}
              onChange={(e) => { handleChange(e, setParamFechas) }}
            />
          </InputContainer>
        </Parameters>
      </ParametersContainer>

      <TitleReport 
          title={`Compromisos plaza ${getPlazaName(paramFechas.plaza)} del ${formatLastDate(paramFechas.fechaInicio)} al ${formatLastDate(paramFechas.fechaFin)}`}
          description = {`ESTE REPORTE OBTIENE EL COMPROMISO DE VENTAS PARA CIERTO RANGO DE FECHAS, 
          QUE PUEDE SER UN MES, UNA SEMANA, UN FIN DE SEMANA, BASADO EN LA FECHAS ESTABLECIDA...
          `}
        />

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

const FechasWithAuth = withAuth(Fechas);
FechasWithAuth.getLayout = getVentasLayout;
export default FechasWithAuth;
