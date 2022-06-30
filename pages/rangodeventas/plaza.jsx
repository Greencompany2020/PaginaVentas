import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
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
  validateInputDateRange,
} from "../../utils/functions";
import { getBeginEndMonth } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getRangoVentasPlaza } from "../../services/RangoVentasService";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Plaza = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { plazas } = useAuth();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(plazas),
    fechaInicio: getBeginEndMonth(true)[0],
    fechaFin: getBeginEndMonth(true)[1],
    rangos: "100,200,300,400,500,600",
    conTiendasCerradas: 0,
  });

  useEffect(()=>{
    if(plazas){
      setParamPlaza(prev => ({
        ...prev, 
        plaza:getInitialPlaza(plazas),
        conTiendasCerradas: config?.conTiendasCerradas || 0,
      }));
    }
  },[plazas, config])

  useEffect(() => {
    (async()=>{
      if(validateInputDateRange(paramPlaza.fechaInicio, paramPlaza.fechaFin) && plazas){
        try {
          const response = await getRangoVentasPlaza(paramPlaza);
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
  }, [paramPlaza]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Rangos de ventas por plaza" />
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
                checked={paramPlaza.conTiendasCerradas}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 h-full pb-4 overflow-y-auto ">
        <ComparativoVentas title="Rangos de ventas por plaza">
          <PieChart
            text="Rangos de ventas por plaza"
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

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
