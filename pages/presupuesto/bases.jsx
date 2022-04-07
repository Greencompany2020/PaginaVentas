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

const porplaza = () => {
  const year = 2000;
  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectPlazas />
          <SelectTiendasGeneral />
          <InputYear value={2022} onChange={() => {}} />
          </InputContainer>
          <InputContainer>
            <Checkbox className="mb-3" labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className="mb-3" labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className="mb-3" labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
          </InputContainer>
          <InputContainer>
          <Checkbox className="mb-3" labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR} />
          <Checkbox className="mb-3" labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla muestra las ventas del día por día del mes y año
          especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title="Ventas Semana Santa">
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
    </>
  );
};

porplaza.getLayout = getVentasLayout;

export default porplaza;
