import { useState, useEffect, Fragment } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { InputContainer, Checkbox, SelectMonth, SelectToMonth, InputYear } from '../../components/inputs';
import { VentasTableContainer, VentasTable, TableHead, TableBody } from '../../components/table';
import { MessageModal } from '../../components/modals';
import { checkboxLabels, inputNames, MENSAJE_ERROR, meses } from '../../utils/data';
import { handleChange } from '../../utils/handlers';
import { getCurrentMonth, getCurrentYear, getMonthChars } from '../../utils/dateFunctions';
import { isError, validateMonthRange, validateYear } from '../../utils/functions';
import { getPromotores } from '../../services/MKTService';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';


const Promotores = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [promotores, setPromotores] = useState({});
  const [paramPromotores, setParamPromotores] = useState({
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    conIva: 0
  });

  useEffect(() => {
    if (validateMonthRange(paramPromotores.delMes, paramPromotores.alMes) && validateYear(paramPromotores.delAgno)) {
      getPromotores(paramPromotores)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setPromotores(response)
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPromotores]);

  const createPromotoresTableHead = () => {
    return meses.slice(0, paramPromotores.alMes).map((mes) => (
      <th key={mes.value}>
        { getMonthChars(mes.text).toUpperCase() }
      </th>
    ));
  }

  const createPromotoresTableRow = (plaza, data) => {
    return (
      <Fragment key={plaza}>
        <tr className="text-center font-bold border border-b-2">
          <th rowSpan={5} className="border border-l-2">{plaza}</th>
          <td>Ingresos</td>
          {
            Object.entries(data).map(([prop, value]) => (
              <Fragment key={prop}>
                <td>{value.ingresos}</td>
              </Fragment>
            ))
          }
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>% Particip.</td>
          {
            Object.entries(data).map(([prop, value]) => (
              <Fragment key={prop}>
                <td>{value.participacion}</td>
              </Fragment>
            ))
          }
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>Operaciones</td>
          {
            Object.entries(data).map(([prop, value]) => (
              <Fragment key={prop}>
                <td>{value.operaciones}</td>
              </Fragment>
            ))
          }
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>Puntos</td>
          {
            Object.entries(data).map(([prop, value]) => (
              <Fragment key={prop}>
                <td>{value.puntos}</td>
              </Fragment>
            ))
          }
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>Canjes</td>
          {
            Object.entries(data).map(([prop, value]) => (
              <Fragment key={prop}>
                <td>{value.canjes}</td>
              </Fragment>
            ))
          }
        </tr>
      </Fragment>
    )
  }

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth 
              value={paramPromotores.delMes}
              onChange={(e) => { handleChange(e, setParamPromotores) }}
            />
            <SelectToMonth
              value={paramPromotores.alMes}
              onChange={(e) => { handleChange(e, setParamPromotores) }}
            />
            <InputYear
              value={paramPromotores.delAgno}
              onChange={(e) => { handleChange(e, setParamPromotores) }}
            />
            <Checkbox 
              className="mb-3"
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamPromotores) }}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla le muestra los ingresgos generados por promotores asi como los canjes resultantes.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title={`Ingresos Promotores ${paramPromotores.delAgno}`}>
        <VentasTable>
          <TableHead>
            <tr>
              <th>PLAZAS</th>
              <th>MESES</th>
              { createPromotoresTableHead() }
              <th>TOTAL</th>
            </tr>
          </TableHead>
          <TableBody>
            {
              Object.entries(promotores).map(([prop, data]) => (
                createPromotoresTableRow(prop, data)
              ))
            }
          </TableBody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

const PromotoresWithAuth = withAuth(Promotores);
PromotoresWithAuth.getLayout = getVentasLayout;
export default PromotoresWithAuth;
