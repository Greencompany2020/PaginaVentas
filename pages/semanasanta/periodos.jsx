import VentasLayout from '@components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '@components/containers';
import { InputContainer,SelectTiendas, SelectMonth, SelectToMonth,InputToYear, InputYear, Checkbox } from '@components/inputs';
import { checkboxLabels } from 'utils/data';
import BarChart from '@components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { VentasTableContainer, SemanaSantaTable, PeriodosSemanaSantaTable } from '../../components/table';


const periodos = () => {
  return (
    <VentasLayout>
      <VentasTableContainer title="Ventas Semana Santa">
        <PeriodosSemanaSantaTable title="PERIODOS DE SEMANA SANTA "></PeriodosSemanaSantaTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default periodos
