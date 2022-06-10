import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
  SmallContainer,
} from "../../components/containers";
import { InputContainer, InputDate, Checkbox } from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
} from "../../components/table";
import { checkboxLabels } from "../../utils/data";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const acumulado = () => {
  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="VENTAS ACUMULADO CEDIS" />

      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputDate />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox className="mb-3" labelText="Facturas de Servicio" />
              <Checkbox className="mb-3" labelText="Solo Piezas" />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>

      <section className=" pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable>
            <TableHead>
              <tr>
                <th rowSpan={2} className="bg-black-shape rounded-tl-xl">
                  Linea
                </th>
                <th rowSpan={2} className="bg-black-shape">
                  Incremental
                </th>
                <th rowSpan={2} className="bg-black-shape">
                  Regular
                </th>
                <th rowSpan={2} className="bg-black-shape">
                  Vta. Actual
                </th>
                <th colSpan={3} className="bg-black-shape">
                  Semana 10-Ene
                </th>
                <th colSpan={3} className="bg-black-shape rounded-tr-xl">
                  Acumulado Anual
                </th>
              </tr>
              <tr>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">2021</th>
                <th className="bg-black-shape">2021</th>
              </tr>
            </TableHead>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const AcumuladoWithAuth = withAuth(acumulado);
AcumuladoWithAuth.getLayout = getVentasLayout;
export default AcumuladoWithAuth;
