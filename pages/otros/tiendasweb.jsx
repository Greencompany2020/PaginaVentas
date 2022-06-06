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
    <div className=" flex flex-col h-full">
      <TitleReport
        title="TIENDAS WEB COMPARATIVO VENTAS DEL AÑO 2022 (AL 12 DE ENERO S/IVA M.N. )"
        description="Este reporte muestra las ventas acumuladas semana-mes-año"
      />

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputDate />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable className="last-row-bg">
            <TableHead>
              <tr>
                <th rowSpan={2} className="bg-black-shape rounded-tl-xl">
                  Pedidos Actuales
                </th>
                <th colSpan={3} className="bg-black-shape">
                  Dia 11 de Enero
                </th>
                <th colSpan={5} className="bg-black-shape">
                  Acumulado Enero
                </th>
                <th colSpan={5} className="bg-black-shape rounded-tr-xl">
                  Acumulado Anual
                </th>
              </tr>
              <tr>
                <th className="bg-black-shape">2022</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">% VS 2021</th>
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
      </section>
    </div>
  );
};

const TiendasWebWithAuth = withAuth(tiendasweb);
TiendasWebWithAuth.getLayout = getVentasLayout;
export default TiendasWebWithAuth;
