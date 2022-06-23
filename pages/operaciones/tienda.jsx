import { useState, useEffect } from "react";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  Checkbox,
  InputContainer,
  InputToYear,
  InputYear,
  SelectMonth,
  SelectTiendas,
  SelectToMonth,
} from "../../components/inputs";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import { getOperacionesTienda } from "../../services/OperacionesService";
import BarChart from "../../components/BarChart";
import {
  checkboxLabels,
  inputNames,
  MENSAJE_ERROR,
  meses,
} from "../../utils/data";
import { getCurrentMonth, getCurrentYear } from "../../utils/dateFunctions";
import {
  getInitialTienda,
  getTiendaName,
  isError,
  validateMonthRange,
  validateYearRange,
} from "../../utils/functions";
import { handleChange } from "../../utils/handlers";
import useGraphData from "../../hooks/useGraphData";
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
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear() - 1,
    alAgno: getCurrentYear(),
    promedio: 0,
    acumulado: 0,
    conIva: 0,
    resultadosPesos: 0,
  });

  useEffect(()=>{
    if(tiendas){
      setParamTienda(prev => ({...prev, tienda:getInitialTienda(tiendas)}))
    }
  },[tiendas])

  useEffect(() => {
    (async()=>{
      if( validateYearRange(paramTienda.delAgno, paramTienda.alAgno) &&  validateMonthRange(paramTienda.delMes, paramTienda.alMes)  && tiendas ){
        try {
          const response = await getOperacionesTienda(paramTienda);
          createOperacionesDatasets(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR 
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTienda, paramTienda.delAgno]);

  const createOperacionesDatasets = (data) => {
    const colors = [
      "#047857",
      "#0E7490",
      "#1D4ED8",
      "#4338ca",
      "#6d28d9",
      "#be185d",
    ];

    if (data?.length !== 0) {
      const labels = [];
      const operacionesDataset = [];

      for (let operacion of data) {
        const month =
          meses.find((mes) => mes.value === operacion.mes)?.text ?? "ACUM";

        const label = `${month} ${operacion.porcentaje}%`;

        labels.push(label);
      }

      let colorIndex = 0;

      for (let i = paramTienda.alAgno; i >= paramTienda.delAgno; i--) {
        let operaciones = data?.map(
          (operacion) => operacion[`operaciones${i}`]
        );

        const operacionesData = {
          label: `Operaciones ${i}`,
          data: operaciones,
          backgroundColor: colors[colorIndex],
        };

        operacionesDataset.push(operacionesData);

        colorIndex++;

        if (colorIndex === colors.length) {
          colorIndex = 0;
        }
      }

      setDatasets(operacionesDataset);
      setLabels(labels);
    } else {
      setDatasets([]);
      setLabels([]);
    }
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Operaciones Realizadas Tienda ${getTiendaName(
          paramTienda.tienda
        )} ${paramTienda.alAgno} - ${paramTienda.delAgno}`}
      />

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={paramTienda.tienda}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <SelectMonth
                value={paramTienda.delMes}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <SelectToMonth
                value={paramTienda.alMes}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
            </InputContainer>
            <InputContainer>
              <InputYear
                value={paramTienda.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <InputToYear
                value={paramTienda.alAgno}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.PROMEDIO}
                name={inputNames.PROMEDIO}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_ACUMULADO}
                name={inputNames.ACUMULATIVA}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamTienda);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
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
          <BarChart
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
