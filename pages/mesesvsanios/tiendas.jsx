import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendas,
  SelectMonth,
  SelectToMonth,
  InputToYear,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import { checkboxLabels, inputNames, MENSAJE_ERROR, plazas } from "../../utils/data";
import {
  calculateCrecimiento,
  getInitialTienda,
  getTiendaName,
  validateMonthRange,
  validateYearRange,
} from "../../utils/functions";
import BarChart from "../../components/BarChart";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import {
  formatLastDate,
  getCurrentMonth,
  getCurrentYear,
  getMonthByNumber,
  getPrevDate,
} from "../../utils/dateFunctions";
import { getMesesAgnosTiendas } from "../../services/MesesAgnosService";
import { handleChange } from "../../utils/handlers";
import useGraphData from "../../hooks/useGraphData";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { useSelector } from "react-redux";

const Tiendas = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const {shops} = useSelector(state => state);
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [parametrosTiendas, setParametrosTiendas] = useState({
    tienda: getInitialTienda(shops),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear() - 1,
    alAgno: getCurrentYear(),
    incluirTotal: config?.incluirTotal || 0,
    ventasDiaMesActual: config?.ventasDiaMesActual || 0,
    conIva: config?.conIva || 0,
  });


  useEffect(() => {
    (async()=>{
      if(validateMonthRange(parametrosTiendas.delMes, parametrosTiendas.alMes) &&
        validateYearRange(parametrosTiendas.delAgno, parametrosTiendas.alAgno) && shops){
          try {
            const response = await getMesesAgnosTiendas(parametrosTiendas);
            createMesesAgnosTiendasDataset(
              response,
              parametrosTiendas.delAgno,
              parametrosTiendas.alAgno
            );
          } catch (error) {
            sendNotification({
              type:'ERROR',
              message:error.response.data.message || error.message
            });
          }
        }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosTiendas, parametrosTiendas.delAgno]);

  const createMesesAgnosTiendasDataset = (data, fromYear, toYear) => {
    const colors = ["#006400", "#daa520", "#6495ed", "#ff7f50", "#98fb98"];

    if (data?.length !== 0) {
      let labels = [];
      labels = data.map((item) =>
        item?.Mes ? getMonthByNumber(item.Mes) : item.Descrip
      );

      setLabels(labels);

      let datasets = [];
      let colorIndex = 0;
      let dataSetIndex = 1;
      for (let i = toYear; i >= fromYear; i--) {
        let ventas = data.map((item) => item[`Ventas${i}`]);
        let ventasPrev = data.map((item) => item[`Ventas${i - 1}`] ?? 0);

        datasets.push({
          id: dataSetIndex,
          label: `${i} ${calculateCrecimiento(ventas, ventasPrev)}%`,
          data: data.map((item) => Math.floor(item[`Ventas${i}`])),
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
        title={`Ventas de la Tienda ${getTiendaName(
          parametrosTiendas.tienda, shops
        )} del año ${parametrosTiendas.delAgno} al año ${
          parametrosTiendas.alAgno
        } (mls.dlls.)`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={parametrosTiendas.tienda}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />

              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <InputYear
                    value={parametrosTiendas.delAgno}
                    onChange={(e) => {
                      handleChange(e, setParametrosTiendas);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <InputToYear
                    value={parametrosTiendas.alAgno}
                    onChange={(e) => {
                      handleChange(e, setParametrosTiendas);
                    }}
                  />
                </div>
              </fieldset>
              
              <fieldset className="flex items-center space-x-1">
                <div className="flex-1">
                  <SelectMonth
                    value={parametrosTiendas.delMes}
                    onChange={(e) => {
                      handleChange(e, setParametrosTiendas);
                    }}
                  />
                </div>
                <div className="flex-1">
                  <SelectToMonth
                    value={parametrosTiendas.alMes}
                    onChange={(e) => {
                      handleChange(e, setParametrosTiendas);
                    }}
                  />
                </div>
              </fieldset>
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TOTAL}
                name={inputNames.INCLUIR_TOTAL}
                checked = {parametrosTiendas.incluirTotal ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
                name={inputNames.VENTAS_DIA_MES_ACTUAL}
                checked = {parametrosTiendas.ventasDiaMesActual ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                checked = {parametrosTiendas.conIva ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        {
          datasets.length > 0 ?
            <ComparativoVentas>
              <BarChart
                text={`${parametrosTiendas.alMes === getCurrentMonth()
                    ? `Ventas al ${formatLastDate(
                      getPrevDate(0, parametrosTiendas.alAgno)
                    )}`
                    : ""
                  }`}
                data={{
                  labels,
                  datasets,
                }}
              />
            </ComparativoVentas>
            :
            <div className=" flex justify-center">
              <h4 className="text-xl">Consulta sin resultados</h4>
            </div>
        }
      </section>
    </div>
  );
};

const TiendasWithAuth = withAuth(Tiendas);
TiendasWithAuth.getLayout = getVentasLayout;
export default TiendasWithAuth;
