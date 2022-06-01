import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
  SmallContainer,
} from "../../components/containers";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import { InputContainer, InputYear, Checkbox } from "../../components/inputs";
import {
  checkboxLabels,
  concentradoPlazas,
  MENSAJE_ERROR,
} from "../../utils/data";
import { inputNames } from "../../utils/data/checkboxLabels";
import { getMensualesConcentrado } from "../../services/MensualesServices";
import { numberWithCommas } from "../../utils/resultsFormated";
import { handleChange } from "../../utils/handlers";
import { isError } from "../../utils/functions";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Concentrado = () => {
  const alert = useAlert();
  const [concentrado, setConcentrado] = useState([]);
  const [concentradoParametros, setConcentradoParametros] = useState({
    delAgno: new Date(Date.now()).getFullYear(),
    conIva: 0,
    ventasMilesDlls: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0,
  });

  useEffect(() => {
    if (concentradoParametros.delAgno.toString().length === 4) {
      getMensualesConcentrado(concentradoParametros).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setConcentrado(response);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concentradoParametros]);

  return (
    <>
      <TitleReport
        title="Ventas Mensuales de tiendas en el año 2022"
        description="Este reporte muestra las ventas por tienda en el año especificado."
      />
      <main className="w-full h-full p-4 md:p-8">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputYear
                value={concentradoParametros.delAgno}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_EN_DLLS}
                name={inputNames.VENTAS_MILES_DLLS}
                checked={concentradoParametros.ventasMilesDlls ? true : false}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>

        <VentasTableContainer>
          <VentasTable className="tfooter">
            <TableHead>
              <tr>
                <th rowSpan={2}>TDA.</th>
                <th>ENE</th>
                <th>FEB</th>
                <th>MAR</th>
                <th>ABR</th>
                <th>MAY</th>
                <th>JUN</th>
                <th>JUL</th>
                <th>AGO</th>
                <th>SEP</th>
                <th>OCT</th>
                <th>NOV</th>
                <th>DIC</th>
                <th>TTAL</th>
              </tr>
              <tr className="text-center">
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>$</th>
                <th>Año</th>
              </tr>
            </TableHead>
            <tbody className="bg-white">
              {concentrado?.map((items) => (
                <TableRow
                  key={items.tienda}
                  rowId={items.tienda}
                  className={`text-center ${
                    concentradoPlazas.includes(items.tienda) &&
                    "bg-gray-300 font-bold"
                  }`}
                >
                  <td className="bg-black text-white font-bold">
                    {items.tienda}
                  </td>
                  <td className="text-sm">{numberWithCommas(items.enero)}</td>
                  <td className="text-sm">{numberWithCommas(items.febrero)}</td>
                  <td className="text-sm">{numberWithCommas(items.marzo)}</td>
                  <td className="text-sm">{numberWithCommas(items.abril)}</td>
                  <td className="text-sm">{numberWithCommas(items.mayo)}</td>
                  <td className="text-sm">{numberWithCommas(items.junio)}</td>
                  <td className="text-sm">{numberWithCommas(items.julio)}</td>
                  <td className="text-sm">{numberWithCommas(items.agosto)}</td>
                  <td className="text-sm">
                    {numberWithCommas(items.septiembre)}
                  </td>
                  <td className="text-sm">{numberWithCommas(items.octubre)}</td>
                  <td className="text-sm">
                    {numberWithCommas(items.noviembre)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(items.diciembre)}
                  </td>
                  <td className="text-sm">{numberWithCommas(items.total)}</td>
                </TableRow>
              ))}
            </tbody>
          </VentasTable>
        </VentasTableContainer>
      </main>
    </>
  );
};

const ConcentradoWithAuth = withAuth(Concentrado);
ConcentradoWithAuth.getLayout = getVentasLayout;
export default ConcentradoWithAuth;
