import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  VentasTableContainer,
  PeriodosSemanaSantaTable,
} from "../../components/table";
import { getSemanaSantaPeriodos } from "../../services/semanaSantaService";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Periodos = () => {
  const sendNotification = useNotification();
  const [periodos, setPeriodos] = useState([]);

  useEffect(() => {
    (async()=>{
      try {
        const response = await  getSemanaSantaPeriodos();
        setPeriodos(response);
      } catch (error) {
        sendNotification({
          type:'ERROR',
          message:error.response.data.message || error.message
        });
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="PERIODOS DE SEMANA SANTA" />
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer title="PERIODOS DE SEMANA SANTA">
          <PeriodosSemanaSantaTable dates={periodos} />
        </VentasTableContainer>
      </section>
    </div>
  );
};

const PeriodosWithAuth = withAuth(Periodos);
PeriodosWithAuth.getLayout = getVentasLayout;
export default PeriodosWithAuth;
