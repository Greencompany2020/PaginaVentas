import { useEffect, useState } from 'react';
import VentasLayout from '../../components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { getDiariasFechas } from '../../services/DiariasServices';
import { meses } from '../../utils/data';

const Fechas = () => {
  const [fechas, setFechas] = useState([]);

  useEffect(() => {
    getDiariasFechas()
      .then(response => setFechas(response))
  }, []);

  const formatLastDate = (date) => {
    let formatedDate = "";
    let dateParts = date.split("-");
    let month = meses.find((mes) => mes.value === Number(dateParts[1]))
    month = month.text.slice(0, 3);
    formatedDate = `${dateParts[2]}-${month}-${dateParts[0]}`;
    return formatedDate;
  }

  return (
    <VentasLayout>
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
    </VentasLayout>
  )
}

export default Fechas
