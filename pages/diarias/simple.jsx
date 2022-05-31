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
  TableHead,
  TableRow,
} from "../../components/table";
import {
  SelectTiendas,
  SelectMonth,
  InputYear,
  InputContainer,
  Checkbox,
} from "../../components/inputs";
import { checkboxLabels, MENSAJE_ERROR } from "../../utils/data";
import { getDiariasTiendaSimple } from "../../services/DiariasServices";
import {
  getInitialTienda,
  getLastTwoNumbers,
  getTiendaName,
  isError,
} from "../../utils/functions";
import { numberWithCommas } from "../../utils/resultsFormated";
import { getMonthByNumber } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import withAuth from "../../components/withAuth";
import { useUser } from "../../context/UserContext";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Simple = () => {
  const alert = useAlert();
  const { tiendas } = useUser();
  const [tiendaSimple, setTiendaSimple] = useState([]);
  const [tiendaSimpleParametros, setTiendaSimpleParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda: getInitialTienda(tiendas),
    conIva: 0,
  });

  useEffect(() => {
    if (tiendaSimpleParametros.tienda) {
      getDiariasTiendaSimple(tiendaSimpleParametros).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setTiendaSimple(response);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendaSimpleParametros]);

  return (
    <>
      <TitleReport
        title={`Ventas Diarias ${getTiendaName(
          tiendaSimpleParametros.tienda
        )} ${getMonthByNumber(tiendaSimpleParametros.delMes)} ${
          tiendaSimpleParametros.delAgno
        }`}
        description=" Esta tabla muestra las ventas vs presupuesto del grupo en el periodo de mes y año especificado, este siempre será comparado contra el año anterior."
      />
      <main className="w-full h-full p-4 md:p-8">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={tiendaSimpleParametros.tienda}
                onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
              />
              <InputYear
                value={tiendaSimpleParametros.delAgno}
                onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
              />
              <SelectMonth
                value={tiendaSimpleParametros.delMes}
                onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
              />
              <Checkbox
                className="mb-2"
                labelText={checkboxLabels.VENTAS_IVA}
                name="conIva"
                onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>

        <VentasTableContainer>
          <VentasTable>
            <TableHead>
              <tr>
                <th colSpan={2} className="border border-white">
                  Dia
                </th>
                <th colSpan={3} className="border border-white">
                  Venta por Dia
                </th>
              </tr>
              <tr>
                <th className="border border-white">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno)}
                </th>
                <th className="border border-white">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno - 1)}
                </th>
                <th className="border border-white">
                  {tiendaSimpleParametros.delAgno}
                </th>
                <th className="border border-white">
                  {tiendaSimpleParametros.delAgno - 1}
                </th>
                <th className="border border-white">Acum</th>
              </tr>
            </TableHead>
            <tbody className="bg-white text-center">
              {tiendaSimple?.map((ventas) => (
                <TableRow key={ventas.dia} rowId={ventas.dia}>
                  <td className="font-bold">{ventas.dia}</td>
                  <td className="text-sm">{ventas.dia}</td>
                  <td className="font-bold">
                    {numberWithCommas(ventas.ventaActual)}
                  </td>
                  <td className="text-sm">
                    {numberWithCommas(ventas.ventaAnterior)}
                  </td>
                  <td className="font-bold">
                    {numberWithCommas(ventas.acumulado)}
                  </td>
                </TableRow>
              ))}
            </tbody>
            <tfoot className="bg-black text-white text-center font-bold">
              <tr>
                <th className="border border-white">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno)}
                </th>
                <th className="border border-white">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno - 1)}
                </th>
                <th className="border border-white">
                  {tiendaSimpleParametros.delAgno}
                </th>
                <th className="border border-white">
                  {tiendaSimpleParametros.delAgno - 1}
                </th>
                <th className="border border-white">Acum</th>
              </tr>
              <tr>
                <th colSpan={2} className="border border-white">
                  Dia
                </th>
                <th colSpan={3} className="border border-white">
                  Venta por Dia
                </th>
              </tr>
            </tfoot>
          </VentasTable>
        </VentasTableContainer>
      </main>
    </>
  );
};

const SimpleWithAuth = withAuth(Simple);
SimpleWithAuth.getLayout = getVentasLayout;
export default SimpleWithAuth;
