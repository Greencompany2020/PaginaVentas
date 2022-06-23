import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
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
  isError,
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
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Tiendas = () => {
  const sendNotification = useNotification();
  const { tiendas } = useAuth();
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const [parametrosTiendas, setParametrosTiendas] = useState({
    tienda: getInitialTienda(tiendas),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear() - 5,
    alAgno: getCurrentYear(),
    incluirTotal: 0,
    ventasDiaMesActual: 0,
    conIva: 0,
  });

  useEffect(()=>{
    if(tiendas){
      setParametrosTiendas(prev => ({...prev, tienda:getInitialTienda(tiendas)}))
    }
  },[tiendas])

  useEffect(() => {
    (async()=>{
      if(validateMonthRange(parametrosTiendas.delMes, parametrosTiendas.alMes) &&
        validateYearRange(parametrosTiendas.delAgno, parametrosTiendas.alAgno) && tiendas){
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
              message:response?.response?.data ?? MENSAJE_ERROR
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
          parametrosTiendas.tienda
        )} del año ${parametrosTiendas.delAgno} al año ${
          parametrosTiendas.alAgno
        } (mls.dlls.)`}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={parametrosTiendas.tienda}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
              <SelectMonth
                value={parametrosTiendas.delMes}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
              <SelectToMonth
                value={parametrosTiendas.alMes}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
            </InputContainer>
            <InputContainer>
              <InputYear
                value={parametrosTiendas.delAgno}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
              <InputToYear
                value={parametrosTiendas.alAgno}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TOTAL}
                name={inputNames.INCLUIR_TOTAL}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
                name={inputNames.VENTAS_DIA_MES_ACTUAL}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParametrosTiendas);
                }}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 h-full overflow-y-auto ">
        <ComparativoVentas>
          <BarChart
            text={`${
              parametrosTiendas.alMes === getCurrentMonth()
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
      </section>
    </div>
  );
};

const TiendasWithAuth = withAuth(Tiendas);
TiendasWithAuth.getLayout = getVentasLayout;
export default TiendasWithAuth;
