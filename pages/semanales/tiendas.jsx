import Link from 'next/link';
import { Flex, SmallContainer, ParametersContainer, Parameters } from '@components/containers';
import VentasLayout from '@components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead } from '@components/table';
import { InputContainer, InputDateRange, Checkbox, SelectTiendasGeneral } from '@components/inputs';
import { semanalesTienda, regiones, checkboxLabels } from 'utils/data';

const tiendas = () => {
  return (
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputDateRange />
          <InputContainer>
            <SelectTiendasGeneral />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
            <Checkbox labelText={checkboxLabels.EXCLUIR_TIENDAS_VENTAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este informe muestra un compartivo de la semana o en rango de fecha selecionado. Recuerde que la comparacions se realiza lunes contra lunes,
        </SmallContainer>
        <SmallContainer>
          lo cual quiere decir que las ventas del año anterior no seran por fecha sino lo que corresponda a los dias de la semana.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title="Detalles de información / Semanales por Tienda">
        <VentasTable className='tfooter'>
          <TableHead>
            <tr>
              <td rowSpan={3} className='border border-white'>Plaza</td>
              <td colSpan={15} className='border border-white'>Del 03 de ENE al 09 de ENE 2022</td>
            </tr>
            <tr>
              <td rowSpan={2} className='border border-white'>Comp</td>
              <td rowSpan={2} className='border border-white'>2021</td>
              <td rowSpan={2} className='border border-white'>%</td>
              <td rowSpan={2} className='border border-white'>2020</td>
              <td colSpan={4} className='border border-white'>operaciones</td>
              <td colSpan={4} className='border border-white'>promedios</td>
              <td colSpan={3} className='border border-white'>Articulos Prom.</td>
            </tr>
            <tr>
              <td className='border border-white'>Comp</td>
              <td className='border border-white'>2022</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>2021</td>
              <td className='border border-white'>comp</td>
              <td className='border border-white'>2021</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>2022</td>
              <td className='border border-white'>2022</td>
              <td className='border border-white'>%</td>
              <td className='border border-white'>2021</td>
            </tr>
          </TableHead>
          <tbody className='bg-white'>
            {
              semanalesTienda.map(item => (
                <tr className={`text-right ${regiones.includes(item.plaza) ? 'bg-gray-300' : ''}`} key={item.plaza}>
                  {
                    regiones.includes(item.plaza) ?
                      (
                        <td className='text-center bg-black text-white font-bold'>
                          {item.plaza}
                        </td>
                      ) : (
                        <td className='text-center bg-black text-white underline font-bold'>
                          <Link href='/informes'><a>{item.plaza}</a></Link>
                        </td>
                      )
                  }
                  <td>{item.comp}</td>
                  <td>{item.fechaActual}</td>
                  <td className='text-red-600 font-bold'>{item.porcentaje}</td>
                  <td>{item.fechaComp}</td>
                  <td>{item.operacionesComp}</td>
                  <td>{item.opeFechaActual}</td>
                  <td className='text-red-600 font-bold'>{item.porcentajeOper}</td>
                  <td>{item.opeFechaActual}</td>
                  <td>{item.promedioComp}</td>
                  <td>{item.promFechaActual}</td>
                  <td className='text-red-600 font-bold'>{item.porcentajeProm}</td>
                  <td>{item.promFechaComp}</td>
                  <td>{item.artFechaActual}</td>
                  <td>{item.porcentajeArt}</td>
                  <td>{item.artFechaComparar}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default tiendas
