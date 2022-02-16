import VentasLayout from "@components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "@components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
  SelectPlazas,
  InputYear,
  Checkbox,
} from "@components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  SemanaSantaTableFooter,
  VentasSemanaSantaHead,
} from "@components/table";
import { ventasDiariasGrupo, checkboxLabels } from "utils/data";
import SemanaSantaTable from "../../components/table/SemanaSantaTable";

const porplaza = () => {
  const year = 2000;
  return (
    <VentasLayout>
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
        <SemanaSantaTable title="M1"></SemanaSantaTable>
        <SemanaSantaTable title="M2"></SemanaSantaTable>
        <SemanaSantaTable title="M3"></SemanaSantaTable>
        <SemanaSantaTable title="M4"></SemanaSantaTable>
        <SemanaSantaTable title="M5"></SemanaSantaTable>
        <SemanaSantaTable title="M6"></SemanaSantaTable>
        <SemanaSantaTable title="M7"></SemanaSantaTable>
        <SemanaSantaTable title="M8"></SemanaSantaTable>
        <SemanaSantaTable title="M9"></SemanaSantaTable>
      </VentasTableContainer>
    </VentasLayout>
  );
};

export default porplaza;
