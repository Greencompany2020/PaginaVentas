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

const powerbrand = () => {
  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="POWERBRAND COMPARATIVO VENTAS DEL AÑO 2022 (AL 11 DE ENERO S/IVA M.N. )" />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputDate />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable className="last-row-bg">
            <TableHead>
              <tr>
                <th rowSpan={2} className="bg-black-shape rounded-tl-xl">
                  Pedidos Actuales
                </th>
                <th colSpan={3} className="bg-black-shape">
                  Semana del 10 de Ene
                </th>
                <th colSpan={5} className="bg-black-shape">
                  Acumulado Enero
                </th>
                <th colSpan={5} className="bg-black-shape rounded-tr-xl">
                  Acumulado Anual
                </th>
              </tr>
              <tr>
                <th className="bg-black-shape">2020</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">%</th>
                <th className="bg-black-shape">Presupuesto</th>
                <th className="bg-black-shape">2022</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">% VS 2021</th>
                <th className="bg-black-shape">% VS Ppto.</th>
                <th className="bg-black-shape">Presupuesto</th>
                <th className="bg-black-shape">2022</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">% VS 2021</th>
                <th className="bg-black-shape">% VS Ppto.</th>
              </tr>
            </TableHead>
            <TableBody>
              <tr className="text-center">
                <td>127,917</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>62,459</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>62,459</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr className="text-center">
                <td>127,917</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>62,459</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>62,459</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </TableBody>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const PowerBrandWithAuth = withAuth(powerbrand);
PowerBrandWithAuth.getLayout = getVentasLayout;
export default PowerBrandWithAuth;
