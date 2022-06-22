import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
  SelectPlazas,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import { VentasTableContainer } from "../../components/table";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import SemanaSantaTable from "../../components/table/SemanaSantaTable";
import { getInitialPlaza, isError, validateYear } from "../../utils/functions";
import { getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getSemanaSantaPlazas } from "../../services/semanaSantaService";
import withAuth from "../../components/withAuth";
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Plaza = () => {
  const sendNotification = useNotification();
  const { plazas } = useAuth();
  const [semanaSantaPlazas, setSemanaSantaPlazas] = useState({});
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(plazas),
    tiendas: 0,
    delAgno: getCurrentYear(),
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    incluirFinSemanaAnterior: 1,
    resultadosPesos: 1,
  });

  useEffect(() => {
    if (validateYear(paramPlaza.delAgno)) {
      getSemanaSantaPlazas(paramPlaza).then((response) => {
        if (isError(response)) {
          sendNotification({
            type:'ERROR',
            message: response?.response?.data ?? MENSAJE_ERROR
          });
        } else {
          setSemanaSantaPlazas(response);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPlaza]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas De Semana Santa del Año ${paramPlaza.delAgno}`}
      />

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                value={paramPlaza.plaza}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <SelectTiendasGeneral
                value={paramPlaza.tiendas}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <InputYear
                value={paramPlaza.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}
                name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.incluirFinSemanaAnterior}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
                checked={paramPlaza.resultadosPesos}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer
          title={`Ventas De Semana Santa del Año ${paramPlaza.delAgno}`}
        >
          {Object.keys(semanaSantaPlazas ?? {}).map((key) => (
            <SemanaSantaTable
              key={key}
              title={key}
              ventas={semanaSantaPlazas[key]}
              year1={paramPlaza.delAgno}
              year2={paramPlaza.delAgno - 1}
            />
          ))}
        </VentasTableContainer>
      </section>
    </div>
  );
};

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
