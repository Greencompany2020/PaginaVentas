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
import { isError } from "../../utils/functions";
import WithAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Grupo = (props) => {
  const alert = useAlert();
  const [parametrosConsulta, setParametrosConsulta] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tiendas: 0,
    conIva: 0,
    semanaSanta: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 0,
  });

  const [diariasGrupo, setDiariasGrupo] = useState([]);

  useEffect(() => {
    if (parametrosConsulta.delAgno.toString().length === 4) {
      getDiariasGrupo(parametrosConsulta).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setDiariasGrupo(response);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosConsulta]);

  return (
    <>
      <TitleReport
        title="Ventas Diarias Grupo Frogs"
        description="Esta tabla muestra las ventas del día por día del mes y año especificado."
      />

      <main className="w-full h-full  p-4 md:p-8">
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
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setParametrosConsulta)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>

        <VentasTableContainer>
          <VentasTable>
            <VentasDiariasTableHead
              currentYear={parametrosConsulta.delAgno}
              month={parametrosConsulta.delMes}
            />
            <tbody className="bg-white text-center">
              {diariasGrupo?.map((diaria) => (
                <TableRow key={diaria.dia} rowId={diaria.dia}>
                  <td className="text-center font-bold">{diaria.dia}</td>
                  <td className="text-center text-sm">{diaria.dia}</td>
                  <td className="font-bold">
                    {numberWithCommas(diaria.ventaActual)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(diaria.ventaAnterior)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(diaria.compromisoDiario)}
                  </td>
                  {formatNumber(diaria.crecimientoDiario)}
                  <td className="font-bold">
                    {numberWithCommas(diaria.acumMensualActual)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(diaria.acumMensualAnterior)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(diaria.compromisoAcum)}
                  </td>
                  {formatNumber(diaria.diferencia)}
                  {formatNumber(diaria.crecimientoMensual)}
                  <td className="font-bold">
                    {numberWithCommas(diaria.acumAnualActual)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(diaria.acumAnualAnterior)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(diaria.compromisoAnual)}
                  </td>
                  {formatNumber(diaria.crecimientoAnual)}
                  <td className="text-center font-bold">{diaria.dia}</td>
                </TableRow>
              ))}
            </tbody>
            <VentasDiariasTableFooter
              currentYear={parametrosConsulta.delAgno}
              month={parametrosConsulta.delMes}
            />
          </VentasTable>
        </VentasTableContainer>
      </main>
    </>
  );
};

const GrupoWithAuth = WithAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
