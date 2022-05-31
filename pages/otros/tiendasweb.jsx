import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
  SmallContainer,
} from "../../components/containers";
import { InputContainer, InputDate } from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableBody,
} from "../../components/table";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";

const tiendasweb = () => {
  return (
    <>
      <TitleReport
        title="TIENDAS WEB COMPARATIVO VENTAS DEL AÑO 2022 (AL 12 DE ENERO S/IVA M.N. )"
        description="Este reporte muestra las ventas acumuladas semana-mes-año"
      />

      <main className="w-full h-full p-4 md:p-8">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputDate />
            </InputContainer>
          </Parameters>
        </ParametersContainer>

        <VentasTableContainer>
          <VentasTable className="last-row-bg">
            <TableHead>
              <tr>
                <th rowSpan={2}>Pedidos Actuales</th>
                <th colSpan={3}>Dia 11 de Enero</th>
                <th colSpan={5}>Acumulado Enero</th>
                <th colSpan={5}>Acumulado Anual</th>
              </tr>
              <tr>
                <th>2022</th>
                <th>2021</th>
                <th>% VS 2021</th>
                <th>Presupuesto</th>
                <th>2022</th>
                <th>2021</th>
                <th>% VS 2021</th>
                <th>% VS Ppto.</th>
                <th>Presupuesto</th>
                <th>2022</th>
                <th>2021</th>
                <th>% VS 2021</th>
                <th>% VS Ppto.</th>
              </tr>
            </TableHead>
            <TableBody>
              <tr className="text-center">
                <td>FROGS</td>
                <td>451</td>
                <td>7,478</td>
                <td>(91)</td>
                <td>0</td>
                <td>54,764</td>
                <td>116,915</td>
                <td>(52)</td>
                <td>0</td>
                <td>0</td>
                <td>54,764</td>
                <td>116,915</td>
                <td>(52)</td>
                <td>0</td>
              </tr>
              <tr className="text-center">
                <td>FROGS</td>
                <td>451</td>
                <td>7,478</td>
                <td>(91)</td>
                <td>0</td>
                <td>54,764</td>
                <td>116,915</td>
                <td>(52)</td>
                <td>0</td>
                <td>0</td>
                <td>54,764</td>
                <td>0</td>
                <td>(52)</td>
                <td>0</td>
              </tr>
            </TableBody>
          </VentasTable>
        </VentasTableContainer>
      </main>
    </>
  );
};

const TiendasWebWithAuth = withAuth(tiendasweb);
TiendasWebWithAuth.getLayout = getVentasLayout;
export default TiendasWebWithAuth;
