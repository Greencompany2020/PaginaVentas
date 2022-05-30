import { useState ,useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { VentasTableContainer, PeriodosSemanaSantaTable } from '../../components/table';
import { getSemanaSantaPeriodos } from '../../services/semanaSantaService';
import { MENSAJE_ERROR } from '../../utils/data';
import { isError } from '../../utils/functions';
import withAuth from '../../components/withAuth';
import {useAlert} from '../../context/alertContext';
import TitleReport from '../../components/TitleReport';


const Periodos = () => {
  const alert = useAlert();
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    getSemanaSantaPeriodos()
      .then(response => {

        if (isError(response)) {
          alert.showAlert(response?.response?.data ?? MENSAJE_ERROR, 'warning', 1000);
        } else {
          setPeriodos(response)
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TitleReport 
         title="PERIODOS DE SEMANA SANTA"
      />
      
      <VentasTableContainer title="PERIODOS DE SEMANA SANTA">
        <PeriodosSemanaSantaTable  dates={periodos}/>
      </VentasTableContainer>
    </>
  )
}

const PeriodosWithAuth = withAuth(Periodos);
PeriodosWithAuth.getLayout = getVentasLayout;
export default PeriodosWithAuth;