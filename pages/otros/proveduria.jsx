import Link from "next/link";
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

const proveduria = () => {
  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="PROVEEDURIA COMPARATIVO VENTAS DEL AÑO 2022 (AL 11 DE ENERO S/IVA M.N. )" />

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
                  Linea
                </th>
                <th colSpan={2} className="bg-black-shape">
                  Pedidos
                </th>
                <th colSpan={5} className="bg-black-shape">
                  Enero
                </th>
                <th colSpan={5} className="bg-black-shape rounded-tr-xl">
                  Acumulado
                </th>
              </tr>
              <tr>
                <th className="bg-black-shape">Regulares</th>
                <th className="bg-black-shape">Increment.</th>
                <th className="bg-black-shape">Pres</th>
                <th className="bg-black-shape">2022</th>
                <th className="bg-black-shape">%</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">%</th>
                <th className="bg-black-shape">Pres.</th>
                <th className="bg-black-shape">2022</th>
                <th className="bg-black-shape">%</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">%</th>
              </tr>
            </TableHead>
            <TableBody>
              <tr className="text-center">
                <td>
                  <Link href="/otros/proveduria">
                    <a className="underline">CTES.PROVEED.EXT</a>
                  </Link>
                </td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr className="text-center">
                <td>
                  <Link href="/otros/proveduria">
                    <a className="underline">CTES.PROVEED.NAC</a>
                  </Link>
                </td>
                <td>985,814</td>
                <td>6,203,664</td>
                <td>0</td>
                <td>246,469</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>246,469</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
              <tr className="text-center">
                <td>TOTALES</td>
                <td>985,814</td>
                <td>6,203,664</td>
                <td>0</td>
                <td>246,469</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>246,469</td>
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

const ProveduriaWithAuth = withAuth(proveduria);
ProveduriaWithAuth.getLayout = getVentasLayout;
export default ProveduriaWithAuth;
