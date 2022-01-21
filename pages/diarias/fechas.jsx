import VentasLayout from '@components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { reporteFechas } from 'utils/data';

const fechas = () => {
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
              reporteFechas.map(item => (
                <tr key={item.tienda} className='text-center'>
                  <td>{item.tienda}</td>
                  <td>{item.ultimaFecha}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default fechas
