import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  InputYear,
  SelectPlazas,
  Checkbox,
} from "../../components/inputs";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import BarChart from "../../components/BarChart";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import {
  getInitialPlaza,
  getPlazaName,
  validateYear,
} from "../../utils/functions";
import {
  formatLastDate,
  getCurrentYear,
  getMonthByNumber,
  getPrevDate,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getMesesAgnosTodasTiendas } from "../../services/MesesAgnosService";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { useSelector } from "react-redux";

const TodasTiendas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const {places} = useSelector(state => state);
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [paramTiendas, setParamTiendas] = useState({
    plaza: getInitialPlaza(places),
    delAgno: getCurrentYear(),
    conIva: config?.conIva || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    resultadosPesos: config?.resultadosPesos || 1,
  });

  useEffect(() => {
    (async()=>{
      if(validateYear(paramTiendas.delAgno) && places){
        try {
          const response = await getMesesAgnosTodasTiendas(paramTiendas);
          createMesesAgnosTiendasDataset(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message:response?.response?.data ?? MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTiendas, paramTiendas.delAgno]);

  const createMesesAgnosTiendasDataset = (data) => {
    const colors = [
      "#b91c1c",
      "#a16207",
      "#4d7c0f",
      "#0369a1",
      "#4338ca",
      "#a21caf",
      "#be123c",
      "#0f172a",
    ];

    const { tiendas, ventas } = data;

    if (ventas?.length !== 0) {
      let labels = [];
      labels = ventas.map((item) => getMonthByNumber(item.Mes));

      setLabels(labels);

      let datasets = [];
      let colorIndex = 0;
      let dataSetIndex = 1;
      for (let tienda of tiendas) {
        datasets.push({
          id: dataSetIndex,
          label: `${tienda.Descrip}`,
          data: ventas.map((venta) =>
            Math.floor(venta[`Ventas${tienda.Descrip}`])
          ),
          backgroundColor: colors[colorIndex],
        });

        colorIndex++;
        dataSetIndex++;

        if (colorIndex === colors.length) {
          colorIndex = 0;
        }
      }

      setDatasets(datasets);
    } else {
      setLabels([]);
      setDatasets([]);
    }
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas por Mes Tiendas Plaza ${getPlazaName(
          paramTiendas.plaza
        )} año ${paramTiendas.delAgno} (mls.${
          paramTiendas.resultadosPesos ? "pesos" : "dlls"
        })`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                value={paramTiendas.plaza}
                onChange={(e) => {
                  handleChange(e, setParamTiendas);
                }}
              />
              <InputYear
                value={paramTiendas.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamTiendas);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                checked={paramTiendas.conIva ? true : false}
                onChange={(e) => {
                  handleChange(e, setParamTiendas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={paramTiendas.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => {
                  handleChange(e, setParamTiendas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                checked={paramTiendas.resultadosPesos ? true : false}
                onChange={(e) => {
                  handleChange(e, setParamTiendas);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        <ComparativoVentas>
          <BarChart
            text={`Ventas al ${formatLastDate(
              getPrevDate(0, paramTiendas.delAgno)
            )}`}
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

const TodasTiendasWithAuth = withAuth(TodasTiendas);
TodasTiendasWithAuth.getLayout = getVentasLayout;
export default TodasTiendasWithAuth;
