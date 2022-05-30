import Link from 'next/link';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, InputDate } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableHead, TableBody } from '../../components/table';
import withAuth from '../../components/withAuth';
import TitleReport from '../../components/TitleReport';

const proveduria = () => {
  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate />
          </InputContainer>
        </Parameters>
      </ParametersContainer>

      <TitleReport 
        title='PROVEEDURIA COMPARATIVO VENTAS DEL AÑO 2022 (AL 11 DE ENERO S/IVA M.N. )'
        description = 'Este reporte muestra las ventas acumuladas dia-semana-mes-año por proveduria.'
      />
      <VentasTableContainer>
        <VentasTable className='last-row-bg'>
          <TableHead>
            <tr>
              <th rowSpan={2}>Linea</th>
              <th colSpan={2}>Pedidos</th>
              <th colSpan={5}>Enero</th>
              <th colSpan={5}>Acumulado</th>
            </tr>
            <tr>
              <th>Regulares</th>
              <th>Increment.</th>
              <th>Pres</th>
              <th>2022</th>
              <th>%</th>
              <th>2021</th>
              <th>%</th>
              <th>Pres.</th>
              <th>2022</th>
              <th>%</th>
              <th>2021</th>
              <th>%</th>
            </tr>
          </TableHead>
          <TableBody>
            <tr className='text-center'>
              <td><Link href='/otros/proveduria'><a className='underline'>CTES.PROVEED.EXT</a></Link></td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr className='text-center'>
              <td><Link href='/otros/proveduria'><a className='underline'>CTES.PROVEED.NAC</a></Link></td>
              <td>985,814</td>
              <td>6,203,664</td>
              <td>0</td>
              <td>246,469</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>246,469</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr className='text-center'>
              <td>TOTALES</td>
              <td>985,814</td>
              <td>6,203,664</td>
              <td>0</td>
              <td>246,469</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>246,469</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const ProveduriaWithAuth = withAuth(proveduria);
ProveduriaWithAuth.getLayout = getVentasLayout;
export default ProveduriaWithAuth;