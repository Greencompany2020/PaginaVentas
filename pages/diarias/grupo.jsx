import { useEffect, useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  InputYear,
  SelectMonth,
  Checkbox,
  SelectTiendasGeneral,
} from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  VentasDiariasTableFooter,
  VentasDiariasTableHead,
  TableRow,
} from "../../components/table";
import { checkboxLabels, MENSAJE_ERROR } from "../../utils/data";
import { getDiariasGrupo } from "../../services/DiariasServices";
import { formatNumber, numberWithCommas } from "../../utils/resultsFormated";
import { inputNames } from "../../utils/data/checkboxLabels";
import { handleChange } from "../../utils/handlers";
import WithAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Grupo = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [parametrosConsulta, setParametrosConsulta] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tiendas: 0,
    conIva: 0,
    semanaSanta: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 0,
  });

  const [diariasGrupo, setDiariasGrupo] = useState([]);

  useEffect(()=>{
    setParametrosConsulta(prev => ({
      ...prev,
      conIva:config?.conIva || 0,
      semanaSanta: config?.semanaSanta|| 0,
      conVentasEventos: config?.conVentasEventos || 0,
      conTiendasCerradas: config?.conTiendasCerradas || 0,
      sinAgnoVenta: config?.sinAgnoVenta || 0,
      sinTiendasSuspendidas:config?.sinTiendasSuspendidas || 0,
      resultadosPesos:config?.resultadosPesos || 0,
    }))
  },[config])

  useEffect(() => {
    (async () => {
      try {
        const response = await getDiariasGrupo(parametrosConsulta);
        setDiariasGrupo(response);
      } catch (error) {
        sendNotification({
          type:'ERROR',
          message:error.message
        })
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosConsulta, parametrosConsulta.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Ventas Diarias Grupo Frogs" />

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectMonth
                value={parametrosConsulta.delMes}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <InputYear
                value={parametrosConsulta.delAgno}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <SelectTiendasGeneral
                value={parametrosConsulta.tienda}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                checked={parametrosConsulta.conIva ? true : false}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.SEMANA_SANTA}
                name={inputNames.SEMANA_SANTA}
                checked={parametrosConsulta.semanaSanta ? true : false}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                checked={parametrosConsulta.conVentasEventos ? true : false}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                checked={parametrosConsulta.conTiendasCerradas ? true : false}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                checked={parametrosConsulta.sinAgnoVenta ? true : false}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                checked={parametrosConsulta.sinTiendasSuspendidas ? true : false}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                checked={parametrosConsulta.resultadosPesos ? true : false}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className=" pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable>
            <VentasDiariasTableHead
              currentYear={parametrosConsulta.delAgno}
              month={parametrosConsulta.delMes}
            />
            <tbody className="bg-white text-center overflow-y-auto">
              {(() => {
                if (Array.isArray(diariasGrupo)) {
                  const items = diariasGrupo?.map((diaria, index) => (
                    <TableRow key={diaria.dia} rowId={diaria.dia}>
                      <td className=" text-right text-xs font-bold">
                        {diaria.dia}
                      </td>
                      <td className="text-right text-xs">{diaria.dia}</td>
                      <td className=" text-right text-xs font-bold">
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
                      <td className="text-right  text-xs">
                        {numberWithCommas(diaria.acumAnualAnterior)}
                      </td>
                      <td className="text-right text-xs">
                        {numberWithCommas(diaria.compromisoAnual)}
                      </td>
                      {formatNumber(diaria.crecimientoAnual)}
                      <td className="text-right text-xs font-bold">
                        {diaria.dia}
                      </td>
                    </TableRow>
                  ));
                  return items;
                }
              })()}
            </tbody>
            <VentasDiariasTableFooter
              currentYear={parametrosConsulta.delAgno}
              month={parametrosConsulta.delMes}
            />
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const GrupoWithAuth = WithAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
