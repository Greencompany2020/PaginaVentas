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
  InputRangos,
  InputDateRange,
  Checkbox,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import PieChart from "../../components/Pie";
import {
  createRangoVentasDataset,
  getInitialPlaza,
  isError,
  validateInputDateRange,
} from "../../utils/functions";
import { getBeginEndMonth } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getRangoVentasPlaza } from "../../services/RangoVentasService";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Plaza = () => {
  const alert = useAlert();
  const { plazas } = useUser();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(plazas),
    fechaInicio: getBeginEndMonth(true)[0],
    fechaFin: getBeginEndMonth(true)[1],
    rangos: "100,200,300,400,500,600",
    conTiendasCerradas: 0,
  });

  useEffect(() => {
    if (validateInputDateRange(paramPlaza.fechaInicio, paramPlaza.fechaFin)) {
      getRangoVentasPlaza(paramPlaza).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          createRangoVentasDataset(response, setLabels, setDatasets);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPlaza]);

  return (
    <>
      <TitleReport
        title="Rangos de ventas por plaza"
        description={`ESTE REPORTE OBTIENE LOS RANGOS DE VENTA, DE LAS FECHAS ESTABLECIDAS. EL RANGO ESTABLEZCALO 
        DE LA FORMA 1,150,250,350,400 QUE INDICA P.E. DEL 1 AL 149.00 DEL 150 AL 249.99.
        `}
      />

      <main className="w-full h-full p-4 md:p-8">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                value={paramPlaza.plaza}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <h2 className="my-2 font-bold">
                Obtener Rangos de Ventas de las fechas:
              </h2>
              <InputDateRange
                beginDate={paramPlaza.fechaInicio}
                endDate={paramPlaza.fechaFin}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <h2 className="my-2 font-bold">Defina los rango requiridos:</h2>
              <InputRangos
                value={paramPlaza.rangos}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
              <Checkbox
                className="mb-3"
                name={inputNames.CON_TIENDAS_CERRADAS}
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParamPlaza);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>

        <ComparativoVentas title="Rangos de ventas por plaza">
          <PieChart
            text="Rangos de ventas por plaza"
            data={{
              labels,
              datasets,
            }}
          />
        </ComparativoVentas>
      </main>
    </>
  );
};

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
