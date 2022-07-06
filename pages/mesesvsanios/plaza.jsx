import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectMonth,
  SelectToMonth,
  InputToYear,
  InputYear,
  Checkbox,
  SelectPlazas,
} from "../../components/inputs";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import BarChart from "../../components/BarChart";
import ComparativoVentas from "../../components/table/ComparativoVentas";
import {
  calculateCrecimiento,
  getInitialPlaza,
  validateMonthRange,
  validateYearRange,
} from "../../utils/functions";
import {
  formatLastDate,
  getCurrentMonth,
  getCurrentYear,
  getMonthByNumber,
  getPrevDate,
} from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import { getMesesAgnosPlazas } from "../../services/MesesAgnosService";
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
  const [parametrosPlazas, setParametrosPlazas] = useState({
    plaza: getInitialPlaza(plazas),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear() - 5,
    alAgno: getCurrentYear(),
    incluirTotal: 0,
    ventasDiaMesActual: 0,
    conIva: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 0,
    detalladoTienda: 0,
    resultadosPesos: 0,
  });


  useEffect(()=>{
    if(plazas){
      setParametrosPlazas(prev => ({
        ...prev, 
        plaza:getInitialPlaza(plazas),
        incluirTotal: config?.incluirTotal || 0,
        ventasDiaMesActual: config?.ventasDiaMesActual || 0,
        conIva: config?.conIva || 0,
        conVentasEventos: config?.conVentasEventos || 0,
        sinAgnoVenta: config?.sinAgnoVenta || 0,
        conTiendasCerradas: config?.conTiendasCerradas || 0,
        sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
        detalladoTienda: config?.detalladoTiendal || 0,
        resultadosPesos: config?.resultadosPesos || 0,
      }))
    }
  },[plazas,config])

  useEffect(() => {
    (async()=>{
      if(validateYearRange(parametrosPlazas.delAgno, parametrosPlazas.alAgno) &&
        validateMonthRange(parametrosPlazas.delMes, parametrosPlazas.alMes) && plazas){
          try {
            const response = await getMesesAgnosPlazas(parametrosPlazas);
            createMesesAgnosPlazasDataset(
              response,
              parametrosPlazas.delAgno,
              parametrosPlazas.alAgno
            );
          } catch (error) {
            sendNotification({
              type:'ERROR',
              message:error.message ?? MENSAJE_ERROR
            });
          }
        }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosPlazas, parametrosPlazas.delAgno]);

  const createMesesAgnosPlazasDataset = (data, fromYear, toYear) => {
    const colors = ["#006400", "#daa520", "#6495ed", "#ff7f50", "#98fb98"];

    if (data?.length !== 0) {
      let labels = [];

      if (parametrosPlazas.detalladoTienda === 1) {
        labels = data.map((item) =>
          item?.Descrip ? item.Descrip : item.DescCta
        );
      } else {
        labels = data.map((item) =>
          item?.Mes ? getMonthByNumber(item.Mes) : item.DescCta
        );
      }

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
        title={`Ventas Plaza del año ${parametrosPlazas.delAgno} al año ${
          parametrosPlazas.alAgno
        } 
          mls.${parametrosPlazas.resultadosPesos === 1 ? "pesos." : "dlls."})`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                value={parametrosPlazas.plaza}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <SelectMonth
                value={parametrosPlazas.delMes}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <SelectToMonth
                value={parametrosPlazas.alMes}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <InputYear
                value={parametrosPlazas.delAgno}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <InputToYear
                value={parametrosPlazas.alAgno}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TOTAL}
                name={inputNames.INCLUIR_TOTAL}
                checked={parametrosPlazas.incluirTotal ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
                name={inputNames.VENTAS_DIA_MES_ACTUAL}
                checked={parametrosPlazas.ventasDiaMesActual ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                checked={parametrosPlazas.conIva ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                checked={parametrosPlazas.conVentasEventos ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                checked={parametrosPlazas.sinAgnoVenta ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                checked={parametrosPlazas.conTiendasCerradas ? true : false}
                onChange={(e) => handleChange(e, setParametrosPlazas)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                checked={parametrosPlazas.sinTiendasSuspendidas ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.DETALLADO_POR_TIENDA}
                checked={parametrosPlazas.detalladoTienda ? true : false}
                name={inputNames.DETALLADO_TIENDA}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
                }}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                checked={parametrosPlazas.resultadosPesos ? true : false}
                onChange={(e) => {
                  handleChange(e, setParametrosPlazas);
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
              parametrosPlazas.alMes === getCurrentMonth()
                ? `Ventas al ${formatLastDate(
                    getPrevDate(0, parametrosPlazas.alAgno)
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

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
