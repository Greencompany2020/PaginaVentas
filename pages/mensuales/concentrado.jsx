import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { ParametersContainer, Parameters, SmallContainer } from '../../components/containers';
import { VentasTableContainer, VentasTable, TableHead } from '../../components/table';
import { InputContainer, InputYear, Checkbox } from '../../components/inputs';
import MessageModal from '../../components/MessageModal';
import { checkboxLabels, concentradoPlazas, MENSAJE_ERROR } from '../../utils/data';
import { inputNames } from '../../utils/data/checkboxLabels';
import { getMensualesConcentrado } from '../../services/MensualesServices';
import { numberWithCommas } from '../../utils/resultsFormated';
import { handleChange } from '../../utils/handlers';
import useMessageModal from '../../hooks/useMessageModal';
import { isError } from '../../utils/functions';

const Concentrado = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [concentrado, setConcentrado] = useState([]);
  const [concentradoParametros, setConcentradoParametros] = useState({
    delAgno: new Date(Date.now()).getFullYear(),
    conIva: 0,
    ventasMilesDlls: 1,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (concentradoParametros.delAgno.toString().length === 4) {
      getMensualesConcentrado(concentradoParametros)
        .then(response => {
          if (isError(response)) {
            setMessage(response?.response?.data ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setConcentrado(response);
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [concentradoParametros]);

  return (
    <>
      <MessageModal message={message} setModalOpen={setModalOpen} modalOpen={modalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear
              value={concentradoParametros.delAgno}
              onChange={(e) => handleChange(e, setConcentradoParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => handleChange(e, setConcentradoParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_EN_DLLS}
              name={inputNames.VENTAS_MILES_DLLS}
              checked={concentradoParametros.ventasMilesDlls ? true : false}
              onChange={(e) => handleChange(e, setConcentradoParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => handleChange(e, setConcentradoParametros)}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setConcentradoParametros)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => handleChange(e, setConcentradoParametros)}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Este reporte muestra las ventas por tienda en el año especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title='Ventas Mensuales de tiendas en el año 2022'>
        <VentasTable className='tfooter'>
          <TableHead>
            <tr>
              <th rowSpan={2}>TDA.</th>
              <th>ENE</th>
              <th>FEB</th>
              <th>MAR</th>
              <th>ABR</th>
              <th>MAY</th>
              <th>JUN</th>
              <th>JUL</th>
              <th>AGO</th>
              <th>SEP</th>
              <th>OCT</th>
              <th>NOV</th>
              <th>DIC</th>
              <th>TTAL</th>
            </tr>
            <tr className='text-center'>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>$</th>
              <th>Año</th>
            </tr>
          </TableHead>
          <tbody className='bg-white'>
            {
              concentrado?.map(items => (
                <tr key={items.tienda} className={`text-center p-1 ${concentradoPlazas.includes(items.tienda) ? 'bg-gray-300' : ''}`}>
                  <td className='bg-black text-white font-bold'>{items.tienda}</td>
                  <td>{numberWithCommas(items.enero)}</td>
                  <td>{numberWithCommas(items.febrero)}</td>
                  <td>{numberWithCommas(items.marzo)}</td>
                  <td>{numberWithCommas(items.abril)}</td>
                  <td>{numberWithCommas(items.mayo)}</td>
                  <td>{numberWithCommas(items.junio)}</td>
                  <td>{numberWithCommas(items.julio)}</td>
                  <td>{numberWithCommas(items.agosto)}</td>
                  <td>{numberWithCommas(items.septiembre)}</td>
                  <td>{numberWithCommas(items.octubre)}</td>
                  <td>{numberWithCommas(items.noviembre)}</td>
                  <td>{numberWithCommas(items.diciembre)}</td>
                  <td>{numberWithCommas(items.total)}</td>
                </tr>
              ))
            }
          </tbody>
        </VentasTable>
      </VentasTableContainer>
    </>
  )
}

Concentrado.getLayout = getVentasLayout;

export default Concentrado
