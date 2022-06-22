import { useEffect, useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
  SmallContainer,
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

const Plaza = () => {
  const sendNotification = useNotification();
  const { plazas } =  useAuth();
  const [diariasPlaza, setDiariasPlaza] = useState([]);
  const [plazaParametros, setPlazaParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    plaza: getInitialPlaza(plazas),
    conIva: 0,
    semanaSanta: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 0,
  });

  useEffect(() => {
    getDiariasPlazas(plazaParametros).then((response) => {
      if (isError(response)) {
        sendNotification({
          type:'ERROR',
          message: response?.response?.data ?? MENSAJE_ERROR,
        })
      } else {
        setDiariasPlaza(response);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plazaParametros, plazaParametros.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas Diarias Plaza ${getPlazaName(plazaParametros.plaza)}`}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
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
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setPlazaParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable>
            <VentasDiariasTableHead
              currentYear={plazaParametros.delAgno}
              month={plazaParametros.delMes}
            />
            <tbody className="bg-white text-center">
              {diariasPlaza?.map((diaria) => (
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
              ))}
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
