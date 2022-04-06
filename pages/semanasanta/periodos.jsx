import { useState ,useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import MessageModal from '../../components/MessageModal';
import { VentasTableContainer, PeriodosSemanaSantaTable } from '../../components/table';
import useMessageModal from '../../hooks/useMessageModal';
import { getSemanaSantaPeriodos } from '../../services/semanaSantaService';
import { MENSAJE_ERROR } from '../../utils/data';
import { isError } from '../../utils/functions';

const Periodos = () => {
  const { message, modalOpen, setMessage, setModalOpen} = useMessageModal();
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    getSemanaSantaPeriodos()
      .then(response => {

        if (isError(response)) {
          setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
          setModalOpen(true);
        } else {
          setPeriodos(response)
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <VentasTableContainer title="PERIODOS DE SEMANA SANTA">
        <PeriodosSemanaSantaTable  dates={periodos}/>
      </VentasTableContainer>
    </>
  )
}

Periodos.getLayout = getVentasLayout;

export default Periodos
