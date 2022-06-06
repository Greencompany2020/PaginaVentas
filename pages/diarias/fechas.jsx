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
    <div className=" flex flex-col h-full">
      <TitleReport title="Reporte de la ultima fecha de venta registrada por tienda" />
      <section className=" p-4 md:p-8 xl:p-16 overflow-y-auto ">
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
                  <td className="">{fecha.tienda}</td>
                  <td>{formatLastDate(fecha.fecha)}</td>
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
