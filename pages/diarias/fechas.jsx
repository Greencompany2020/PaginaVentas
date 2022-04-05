import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import MessageModal from '../../components/MessageModal';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import useMessageModal from '../../hooks/useMessageModal';
import { getDiariasFechas } from '../../services/DiariasServices';
import { formatLastDate } from '../../utils/dateFunctions';

const Fechas = () => {
  const { modalOpen, message, setMessage, setModalOpen } = useMessageModal();
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    getDiariasFechas()
      .then(response => {
        if (response instanceof Error) {
          setMessage(response?.response?.data ?? "Ha ocurrido un error al consultar. Vea la consola (F12)");
          setModalOpen(true);
          return;
        }
        setFechas(response);
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <MessageModal message={message} setShowModal={setModalOpen} showModal={modalOpen} />
      <VentasTableContainer title="Reporte de la ultima fecha de venta registrada por tienda">
        <VentasTable>
          <TableHead>
            <tr>
              <th className='border border-white'>Tienda</th>
              <th className='border border-white'>Ultima Fecha Registrada</th>
            </tr>
          </TableHead>
          <tbody className='bg-white'>
            {
              fechas?.map((fecha, index) => (
                <tr key={index} className='text-center'>
                  <td>{fecha.tienda}</td>
                  <td>{formatLastDate(fecha.fecha)}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Fechas.getLayout = getVentasLayout;

export default Fechas
