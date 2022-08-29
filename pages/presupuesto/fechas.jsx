import { useState, useEffect } from "react";
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
import { handleChange } from "../../utils/handlers";
import {
  getInitialPlaza,
  getPlazaName,
  validateInputDateRange,
} from "../../utils/functions";
import { formatLastDate, getBeginEndMonth } from "../../utils/dateFunctions";
import { getPresupuestoFechas } from "../../services/PresupuestoService";
import { MENSAJE_ERROR } from "../../utils/data";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { useSelector } from "react-redux";

const Fechas = () => {
  const sendNotification = useNotification();
  const {places} = useSelector(state => state);
  const [prespuestos, setPrespuestos] = useState({});
  const [paramFechas, setParamFechas] = useState({
    plaza: getInitialPlaza(places),
    fechaInicio: getBeginEndMonth()[0],
    fechaFin: getBeginEndMonth()[1],
  });



  useEffect(() => {
    (async()=>{
      if(validateInputDateRange(paramFechas.fechaInicio, paramFechas.fechaFin) && places){
        try {
          const response = await getPresupuestoFechas(paramFechas);
          setPrespuestos(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: error.response.data.message || error.message
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramFechas]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Compromisos plaza ${getPlazaName(
          paramFechas.plaza
        )} del ${formatLastDate(paramFechas.fechaInicio)} al ${formatLastDate(
          paramFechas.fechaFin
        )}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                value={paramFechas.plaza}
                onChange={(e) => {
                  handleChange(e, setParamFechas);
                }}
              />
              <InputDateRange
                beginDate={paramFechas.fechaInicio}
                endDate={paramFechas.fechaFin}
                onChange={(e) => {
                  handleChange(e, setParamFechas);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer
          title={`Compromisos plaza ${getPlazaName(
            paramFechas.plaza
          )} del ${formatLastDate(paramFechas.fechaInicio)} al ${formatLastDate(
            paramFechas.fechaFin
          )}`}
        >
          {Object.entries(prespuestos).map(([key, value]) => (
            <PresupuestoTable key={key} title={key} presupuestos={value} />
          ))}
        </VentasTableContainer>
      </section>
    </div>
  );
};

const FechasWithAuth = withAuth(Fechas);
FechasWithAuth.getLayout = getVentasLayout;
export default FechasWithAuth;
