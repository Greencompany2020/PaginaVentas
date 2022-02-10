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
import { InputDateDate } from "../../components/inputs";
import { PresupuestoTable,PresupuestoFechaHead } from "../../components/table";

const porfechas = () => {
  const year = 2000;
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectPlazas/>
          </InputContainer>
          <InputContainer>
          <h1>Obtener compromiso para los días:</h1>
          <InputDateDate/>
          </InputContainer>
        </Parameters>
        <SmallContainer>
        ESTE REPORTE OBTIENE EL COMPROMISO DE VENTAS PARA CIERTO RANGO DE FECHAS,
        </SmallContainer>
        <SmallContainer>
        QUE PUEDE SER UN MES, UNA SEMANA, UN FIN DE SEMANA, BASADO EN LA FECHAS ESTABLECIDA...
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title="Presupuesto">
        
        <PresupuestoTable title="M1"></PresupuestoTable>
        <PresupuestoTable title="M2"></PresupuestoTable>
        <PresupuestoTable title="M3"></PresupuestoTable>
        <PresupuestoTable title="M4"></PresupuestoTable>
        <PresupuestoTable title="M5"></PresupuestoTable>
        <PresupuestoTable title="M6"></PresupuestoTable>
        <PresupuestoTable title="M7"></PresupuestoTable>
        <PresupuestoTable title="M8"></PresupuestoTable>
        <PresupuestoTable title="M9"></PresupuestoTable>
      </VentasTableContainer>
    </VentasLayout>
  );
};

export default porfechas;
