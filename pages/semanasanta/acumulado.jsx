import Link from 'next/link';
import { Flex, SmallContainer, ParametersContainer, Parameters } from '@components/containers';
import VentasLayout from '@components/layout/VentasLayout';
import { VentasTableContainer, VentasTable, TableHead,AcumuladoSemanaSantaFooter } from '@components/table';
import { InputContainer, Checkbox, InputOfTheDate, InputVsYear, SelectTiendasGeneral } from '@components/inputs';
import { semanalesTienda, regiones, checkboxLabels } from 'utils/data';

const acumulado = ({day1,day2,year1,year2}) => {
  return (
    day1 = "day1",
    day2 = "day2",
    year1 = "year1",
    year2 = "year2",
    <VentasLayout>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <InputOfTheDate/>
          <InputVsYear/>
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
            <Checkbox className='mb-3' labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_LOGRO} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} />
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR} />
            <Checkbox labelText={checkboxLabels.RESULTADO_PESOS} />
          </InputContainer>
        </Parameters>
        <SmallContainer>
        
        Este reporte muestra la venta del dia y la venta acumulada de la   semana santa en la fecha especificada.

        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title="Ventas Semana Santa del año 2022 -iva no incluido">
        <VentasTable >
          <TableHead>
            <tr>
              <td rowSpan={3} className='border border-white'>Tienda</td>
              <td colSpan={10} className='border border-white'>{day1}</td>
              <td colSpan={4} className='border border-white'>{day2}</td>
            </tr>
            <tr>
              <td colSpan={4} className='border border-white'>Venta</td>
              <td colSpan={3} className='border border-white'>Promedio</td>
              <td colSpan={3} className='border border-white'>Operaciones</td>
              <td colSpan={4} className='border border-white'>Venta</td>
            </tr>
            <tr>
              <td rowSpan={2} className='border border-white'>{year1}</td>
              <td rowSpan={2} className='border border-white'>{year2}</td>
              <td rowSpan={2} className='border border-white'>PPTO.</td>
              <td rowSpan={2} className='border border-white'>%</td>
              <td rowSpan={2} className='border border-white'>{year1}</td>
              <td rowSpan={2} className='border border-white'>{year2}</td>
              <td rowSpan={2} className='border border-white'>%</td>
              <td rowSpan={2} className='border border-white'>{year1}</td>
              <td rowSpan={2} className='border border-white'>{year2}</td>
              <td rowSpan={2} className='border border-white'>%</td>
              <td rowSpan={2} className='border border-white'>{year1}</td>
              <td rowSpan={2} className='border border-white'>{year2}</td>
              <td rowSpan={2} className='border border-white'>PPTO.</td>
              <td rowSpan={3} className='border border-white'>%</td>
              
            </tr>
          </TableHead>
          <AcumuladoSemanaSantaFooter/>
          
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
                  
                </tr>
              ))
            }
          </tbody>
          
        </VentasTable>
      </VentasTableContainer>
    </VentasLayout>
  )
}

export default acumulado
