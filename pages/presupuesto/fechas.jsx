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
  isError,
  validateInputDateRange,
} from "../../utils/functions";
import { formatLastDate, getBeginEndMonth } from "../../utils/dateFunctions";
import { getPresupuestoFechas } from "../../services/PresupuestoService";
import { MENSAJE_ERROR } from "../../utils/data";
import withAuth from "../../components/withAuth";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

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
      getPresupuestoFechas(paramFechas).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setPrespuestos(response);
        }
      });
    }
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
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
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
      <section className=" pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
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
