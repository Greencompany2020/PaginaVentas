import { useEffect, useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import { getDiariasFechas } from "../../services/DiariasServices";
import { MENSAJE_ERROR } from "../../utils/data";
import { formatLastDate } from "../../utils/dateFunctions";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Fechas = (props) => {
  const sendNotification = useNotification();
  const [fechas, setFechas] = useState([]);


  useEffect(() => {
    (async()=>{
      try {
        const response = await getDiariasFechas();
        setFechas(response);
      } catch (error) {
        sendNotification({
          type:'ERROR',
          message:response?.response?.data ?? MENSAJE_ERROR,
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Reporte de la ultima fecha de venta registrada por tienda" />
      <section className=" p-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable>
            <TableHead>
              <tr>
                <th className="border border-white bg-black-shape rounded-tl-xl">
                  Tienda
                </th>
                <th className="border border-white bg-black-shape rounded-tr-xl">
                  Ultima Fecha Registrada
                </th>
              </tr>
            </TableHead>
            <tbody className="bg-white">
              {fechas?.map((fecha, index) => (
                <TableRow key={index} rowId={index} className="text-center">
                  <td className="text-xs text-left">{fecha.tienda}</td>
                  <td className="text-xs text-left">
                    {formatLastDate(fecha.fecha)}
                  </td>
                </TableRow>
              ))}
            </tbody>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const FechasWithAuth = withAuth(Fechas);
FechasWithAuth.getLayout = getVentasLayout;
export default FechasWithAuth;
