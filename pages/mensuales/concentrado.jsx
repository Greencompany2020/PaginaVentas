import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  VentasTableContainer,
} from "../../components/table";
import { InputContainer, InputYear, Checkbox } from "../../components/inputs";
import {
  checkboxLabels,
} from "../../utils/data";
import { inputNames } from "../../utils/data/checkboxLabels";
import { getMensualesConcentrado } from "../../services/MensualesServices";
import { numberWithCommas, isRegionOrPlaza, selectRow } from "../../utils/resultsFormated";
import { handleChange } from "../../utils/handlers";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";
import { v4 } from "uuid";

const Concentrado = (props) => {
  const { config } = props;
  const sendNotification = useNotification();
  const [concentrado, setConcentrado] = useState([]);
  const [concentradoParametros, setConcentradoParametros] = useState({
    delAgno: new Date(Date.now()).getFullYear(),
    conIva: config?.conIva || 0,
    ventasMilesDlls: config?.ventasMilesDlls || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradas || 0,
    resultadosPesos: config?.resultadosPesos || 0,
  });

  useEffect(() => {
    (async () => {
      if (concentradoParametros.delAgno.toString().length === 4) {
        try {
          const response = await getMensualesConcentrado(concentradoParametros);
          setConcentrado(response);
        } catch (error) {
          sendNotification({
            type: 'ERROR',
            message: error.response.data.message || error.message
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concentradoParametros, ParametersContainer.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title={`Ventas Mensuales de tiendas en el año  ${concentradoParametros.delAgno}`} />
      <section className="p-4 flex flex-row justify-between items-baseline">
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
                checked={concentradoParametros.conIva ? true : false}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
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
                checked={concentradoParametros.conVentasEventos ? true : false}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={concentradoParametros.conTiendasCerradas ? true : false}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
                checked={concentradoParametros.resultadosPesos ? true : false}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setConcentradoParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer>
          <table className="table-report" onClick={selectRow}>
            <thead>
              <tr>
                <th rowSpan={2}  className={"text-left table-report--sticky w-16"}>TDA.</th>
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
                <th>TOTAL</th>
              </tr>
              <tr className="text-right">
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
            </thead>
            <tbody>
              {
                concentrado &&
                concentrado.map(item => (
                  <tr data-row-format={isRegionOrPlaza(item.tienda)} key={v4()}>
                    <td className="priority-cell table-report--sticky text-left ">{item.tienda}</td>
                    <td>{numberWithCommas(item.enero)}</td>
                    <td>{numberWithCommas(item.febrero)}</td>
                    <td>{numberWithCommas(item.marzo)}</td>
                    <td>{numberWithCommas(item.abril)}</td>
                    <td>{numberWithCommas(item.mayo)}</td>
                    <td>{numberWithCommas(item.junio)}</td>
                    <td>{numberWithCommas(item.julio)}</td>
                    <td>{numberWithCommas(item.agosto)}</td>
                    <td>{numberWithCommas(item.septiembre)}</td>
                    <td>{numberWithCommas(item.octubre)}</td>
                    <td>{numberWithCommas(item.noviembre)}</td>
                    <td>{numberWithCommas(item.diciembre)}</td>
                    <td>{numberWithCommas(item.total)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const ConcentradoWithAuth = withAuth(Concentrado);
ConcentradoWithAuth.getLayout = getVentasLayout;
export default ConcentradoWithAuth;
