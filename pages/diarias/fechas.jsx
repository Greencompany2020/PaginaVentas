import { useEffect, useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import { MessageModal } from "../../components/modals";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import useMessageModal from "../../hooks/useMessageModal";
import { getDiariasFechas } from "../../services/DiariasServices";
import { MENSAJE_ERROR } from "../../utils/data";
import { formatLastDate } from "../../utils/dateFunctions";
import { isError } from "../../utils/functions";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Fechas = () => {
  const alert = useAlert();
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    getDiariasFechas().then((response) => {
      if (isError(response)) {
        alert.showAlert(
          response?.response?.data ?? MENSAJE_ERROR,
          "warning",
          1000
        );
      } else {
        setFechas(response);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TitleReport title="Reporte de la ultima fecha de venta registrada por tienda" />
      <main className="w-full h-full p-4 md:p-8">
        <VentasTableContainer>
          <VentasTable>
            <TableHead>
              <tr>
                <th className="border border-white">Tienda</th>
                <th className="border border-white">Ultima Fecha Registrada</th>
              </tr>
            </TableHead>
            <tbody className="bg-white">
              {fechas?.map((fecha, index) => (
                <TableRow key={index} rowId={index} className="text-center">
                  <td>{fecha.tienda}</td>
                  <td>{formatLastDate(fecha.fecha)}</td>
                </TableRow>
              ))}
            </tbody>
          </VentasTable>
        </VentasTableContainer>
      </main>
    </>
  );
};

const FechasWithAuth = withAuth(Fechas);
FechasWithAuth.getLayout = getVentasLayout;
export default FechasWithAuth;
