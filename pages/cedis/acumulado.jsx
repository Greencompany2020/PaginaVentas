import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, InputDate, Checkbox } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { checkboxLabels } from '../../utils/data';
import withAuth from '../../components/withAuth';

const acumulado = () => {
  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputDate />
            <Checkbox className='mb-3' labelText={checkboxLabels.VENTAS_IVA} />
          </InputContainer>
          <InputContainer>
            <Checkbox className='mb-3' labelText='Facturas de Servicio' />
            <Checkbox className='mb-3' labelText='Solo Piezas' />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          ESTA REPORTE MUESTRA LAS VENTAS ACUMULADAS DIA - SEMANA - MES -AÑO
        </SmallContainer>
      </ParametersContainer>
      <VentasTableContainer>
        <VentasTable>
          <TableHead>
            <tr>
              <th rowSpan={2}>Linea</th>
              <th rowSpan={2}>Incremental</th>
              <th rowSpan={2}>Regular</th>
              <th rowSpan={2}>Vta. Actual</th>
              <th colSpan={3}>Semana 10-Ene</th>
              <th colSpan={3}>Acumulado Anual</th>
            </tr>
            <tr>
              <th>2021</th>
              <th>2021</th>
              <th>2021</th>
              <th>2021</th>
              <th>2021</th>
              <th>2021</th>
            </tr>
          </TableHead>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const AcumuladoWithAuth = withAuth(acumulado);
AcumuladoWithAuth.getLayout = getVentasLayout;
export default AcumuladoWithAuth;
