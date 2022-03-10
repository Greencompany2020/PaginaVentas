import { useState ,useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { VentasTableContainer, PeriodosSemanaSantaTable } from '../../components/table';
import { getSemanaSantaPeriodos } from '../../services/semanaSantaService';

const Periodos = () => {
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    getSemanaSantaPeriodos()
      .then(response => setPeriodos(response));
  }, []);

  return (
    <>
      <VentasTableContainer title="PERIODOS DE SEMANA SANTA">
        <PeriodosSemanaSantaTable  dates={periodos}/>
      </VentasTableContainer>
    </>
  )
}

Periodos.getLayout = getVentasLayout;

export default Periodos
