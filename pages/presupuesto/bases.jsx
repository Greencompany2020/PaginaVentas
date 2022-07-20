import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
  SelectPlazas,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import { VentasTableContainer } from "../../components/table";
import PresupuestoBasesTable from "../../components/table/PresupuestoBasesTable";
import { checkboxLabels } from "utils/data";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";

const porplaza = () => {
  const year = 2000;
  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Ventas Semana Santa" />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas />
              <SelectTiendasGeneral />
              <InputYear value={2022} onChange={() => {}} />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.RESULTADO_PESOS}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer>
          <PresupuestoBasesTable title="M1"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M2"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M3"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M4"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M5"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M6"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M7"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M8"></PresupuestoBasesTable>
          <PresupuestoBasesTable title="M9"></PresupuestoBasesTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const PorPlazaWithAuth = withAuth(porplaza);
PorPlazaWithAuth.getLayout = getVentasLayout;
export default PorPlazaWithAuth;
