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
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Tienda = () => {
  const sendNotification = useNotification();
  const { tiendas } = useAuth();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(tiendas),
    fechaInicio: getBeginEndMonth(true)[0],
    fechaFin: getBeginEndMonth(true)[1],
    rangos: "100,200,300,400,500,600",
  });

  useEffect(()=>{
    if(tiendas){
      setParamTienda(prev => ({...prev,tienda: getInitialTienda(tiendas)}));
    }
  },[tiendas])

  useEffect(() => {
    (async()=>{
      if(validateInputDateRange(paramTienda.fechaInicio, paramTienda.fechaFin) && tiendas){
        try {
          const response = await getRangoVentasTienda(paramTienda);
          createRangoVentasDataset(response, setLabels, setDatasets);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Rangos de ventas por Tienda" />
      <section className="p-4 flex flex-row justify-between items-baseline">
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
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        <ComparativoVentas>
          <PieChart
            data={{
              labels,
              datasets,
            }}
          />
        </ComparativoVentas>
      </section>
    </div>
  );
};

const TiendaWithAuth = withAuth(Tienda);
TiendaWithAuth.getLayout = getVentasLayout;
export default TiendaWithAuth;
