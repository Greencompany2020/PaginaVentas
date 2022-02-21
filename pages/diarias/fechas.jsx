import { useEffect, useState } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { getDiariasFechas } from '../../services/DiariasServices';
import { formatLastDate } from '../../utils/dateFunctions';

const Fechas = () => {
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    getDiariasFechas()
      .then(response => setFechas(response))
  }, []);

  return (
    <>
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
