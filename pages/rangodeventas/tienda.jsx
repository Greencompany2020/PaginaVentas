import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  InputDateRange,
  InputRangos,
  SelectTiendas,
} from "../../components/inputs";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import PieChart from "../../components/Pie";
import {
  createRangoVentasDataset,
  getInitialTienda,
  isError,
  validateInputDateRange,
} from "../../utils/functions";
import { getBeginEndMonth } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getRangoVentasTienda } from "../../services/RangoVentasService";
import useGraphData from "../../hooks/useGraphData";
import { MENSAJE_ERROR } from "../../utils/data";
import withAuth from "../../components/withAuth";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Tienda = () => {
  const alert = useAlert();
  const { tiendas } = useUser();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(tiendas),
    fechaInicio: getBeginEndMonth(true)[0],
    fechaFin: getBeginEndMonth(true)[1],
    rangos: "100,200,300,400,500,600",
  });

  useEffect(() => {
    if (validateInputDateRange(paramTienda.fechaInicio, paramTienda.fechaFin)) {
      getRangoVentasTienda(paramTienda).then((response) => {
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
  }, [paramTienda]);

  return (
    <>
      <TitleReport
        title="Rangos de ventas por Tienda"
        description={` ESTE REPORTE OBTIENE LOS RANGOS DE VENTA, DE LAS FECHAS ESTABLECIDAS. EL RANGO ESTABLEZCALO 
        DE LA FORMA 1,150,250,350,400 QUE INDICA P.E. DEL 1 AL 149.00 DEL 150 AL 249.99.
        `}
      />
      <main className="w-full h-full p-4 md:p-8">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={paramTienda.tienda}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <h1>Obtener Rangos de Ventas de las fechas:</h1>
              <InputDateRange
                beginDate={paramTienda.fechaInicio}
                endDate={paramTienda.fechaFin}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <InputRangos
                value={paramTienda.rangos}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>

        <ComparativoVentas>
          <PieChart
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

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
