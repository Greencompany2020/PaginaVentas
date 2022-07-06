import { useEffect, useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  VentasTableContainer,
  VentasTable,
  VentasDiariasTableHead,
  VentasDiariasTableFooter,
  TableRow,
} from "../../components/table";
import {
  InputContainer,
  SelectPlazas,
  SelectMonth,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import { checkboxLabels, MENSAJE_ERROR } from "../../utils/data";
import { getDiariasPlazas } from "../../services/DiariasServices";
import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";
import { getInitialPlaza, getPlazaName, isError } from "../../utils/functions";
import { inputNames } from "../../utils/data/checkboxLabels";
import { handleChange } from "../../utils/handlers";
import withAuth from "../../components/withAuth";
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Plaza = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { plazas } =  useAuth();
  const [diariasPlaza, setDiariasPlaza] = useState([]);
  const [plazaParametros, setPlazaParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    plaza: getInitialPlaza(plazas),
    conIva: 0,
    semanaSanta: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 0,
  });

  useEffect(()=>{
    if(plazas){
      setPlazaParametros(prev => ({
        ...prev, 
        plaza:getInitialPlaza(plazas),
        conIva: config?.conIva || 0,
        semanaSanta: config?.semanaSanta || 0,
        conVentasEventos: config?.conVentasEventos || 0,
        conTiendasCerradas: config?.conTiendasCerradas || 0,
        sinAgnoVenta: config?.sinAgnoVenta || 0,
        sinTiendasSuspendidas: config?.sinTiendasSuspendidas || 0,
        resultadosPesos: config?.resultadosPesos || 0,
      }));
    }
  },[plazas, config])

  useEffect(() => {
    (async()=>{
      if(plazas){
        try {
          const response = await getDiariasPlazas(plazaParametros);
          setDiariasPlaza(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR,
          })
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazaParametros, plazaParametros.delAgno,]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas Diarias Plaza ${getPlazaName(plazaParametros.plaza)}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                onChange={(e) => handleChange(e, setPlazaParametros)}
                value={plazaParametros.plaza}
              />
              <SelectMonth
                value={plazaParametros.delMes}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
              <InputYear
                value={plazaParametros.delAgno}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={plazaParametros.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.SEMANA_SANTA}
                checked={plazaParametros.semanaSanta ? true : false}
                name={inputNames.SEMANA_SANTA}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                checked={plazaParametros.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                checked={plazaParametros.conTiendasCerradas ? true : false}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                checked={plazaParametros.sinAgnoVenta ? true : false}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                checked={plazaParametros.sinTiendasSuspendidas ? true : false}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                checked={plazaParametros.resultadosPesos ? true : false}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable>
            <VentasDiariasTableHead
              currentYear={plazaParametros.delAgno}
              month={plazaParametros.delMes}
            />
            <tbody className="bg-white text-center">
              {(()=>{
                if(diariasPlaza.length > 0){
                  const Items = diariasPlaza?.map((diaria) => (
                    <TableRow key={diaria.dia} rowId={diaria.dia}>
                      <td className="text-right text-xs font-bold">{diaria.dia}</td>
                      <td className="text-right text-xs">{diaria.dia}</td>
                      <td className="text-right text-xs font-bold">
                        {numberWithCommas(diaria.ventaActual)}
                      </td>
                      <td className="text-right text-xs">
                        {numberWithCommas(diaria.ventaAnterior)}
                      </td>
                      <td className="text-right text-xs">
                        {numberWithCommas(diaria.compromisoDiario)}
                      </td>
                      {formatNumber(diaria.crecimientoDiario)}
                      <td className="text-right text-xs font-bold">
                        {numberWithCommas(diaria.acumMensualActual)}
                      </td>
                      <td className="text-right text-xs">
                        {numberWithCommas(diaria.acumMensualAnterior)}
                      </td>
                      <td className="text-right text-xs">
                        {numberWithCommas(diaria.compromisoAcum)}
                      </td>
                      {formatNumber(diaria.diferencia)}
                      {formatNumber(diaria.crecimientoMensual)}
                      <td className="text-right text-xs font-bold">
                        {numberWithCommas(diaria.acumAnualActual)}
                      </td>
                      <td className="text-right text-xs">
                        {numberWithCommas(diaria.acumAnualAnterior)}
                      </td>
                      <td className="text-right text-xs">
                        {numberWithCommas(diaria.compromisoAnual)}
                      </td>
                      {formatNumber(diaria.crecimientoAnual)}
                      <td className="text-right text-xs font-bold">{diaria.dia}</td>
                    </TableRow>
                  ));
                return Items
                }
                return <></>
              })()}
            </tbody>
            <VentasDiariasTableFooter
              currentYear={plazaParametros.delAgno}
              month={plazaParametros.delMes}
            />
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const PlazaWithAuth = withAuth(Plaza);
PlazaWithAuth.getLayout = getVentasLayout;
export default PlazaWithAuth;
