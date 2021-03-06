import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, InputYear, SelectPlazas, Checkbox } from '../../components/inputs';
import { checkboxLabels, inputNames, MENSAJE_ERROR } from '../../utils/data';
import BarChart from '../../components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { MessageModal } from '../../components/modals';
import { getInitialPlaza, getPlazaName, isError, validateYear } from '../../utils/functions';
import { formatLastDate, getCurrentYear, getMonthByNumber, getPrevDate } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getMesesAgnosTodasTiendas } from '../../services/MesesAgnosService';
import useGraphData from '../../hooks/useGraphData';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';

const TodasTiendas = () => {
  const { datasets, labels, setDatasets, setLabels } = useGraphData();
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [paramTiendas, setParamTiendas] = useState({
    plaza: 0,
    delAgno: getCurrentYear(),
    conIva: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 1
  });

  useEffect(() => {
    if (validateYear(paramTiendas.delAgno)) {
      getMesesAgnosTodasTiendas(paramTiendas)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            createMesesAgnosTiendasDataset(response);
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramTiendas]);

  const createMesesAgnosTiendasDataset = (data) => {
    const colors = ['#b91c1c', '#a16207', '#4d7c0f', '#0369a1', '#4338ca', '#a21caf', '#be123c', '#0f172a'];

    const { tiendas, ventas } = data;

    if (ventas?.length !== 0) {
      let labels = [];
      labels = ventas.map(item => getMonthByNumber(item.Mes));

      setLabels(labels);

      let datasets = [];
      let colorIndex = 0;
      let dataSetIndex = 1;
      for (let tienda of tiendas) {
        datasets.push({
          id: dataSetIndex,
          label: `${tienda.Descrip}`,
          data: ventas.map(venta => Math.floor(venta[`Ventas${tienda.Descrip}`])),
          backgroundColor: colors[colorIndex]
        });

        colorIndex++;
        dataSetIndex++;

        if (colorIndex === colors.length) {
          colorIndex = 0;
        }
      }

      setDatasets(datasets);
    } else {
      setLabels([]);
      setDatasets([]);
    }
  }

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas
              value={paramTiendas.plaza}
              onChange={(e) => { handleChange(e, setParamTiendas) }}
            />
            <InputYear
              value={paramTiendas.delAgno}
              onChange={(e) => { handleChange(e, setParamTiendas) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamTiendas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParamTiendas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              checked={paramTiendas.resultadosPesos}
              onChange={(e) => { handleChange(e, setParamTiendas) }}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta grafica muestra un comparativo de las ventas por mes de todas las tiendas de la plaza seleccionada en el a??o que fue especificado.
        </SmallContainer>
        <SmallContainer>
          Recuerde que el rango de a??os debe ser capturado de menor a el mayor, aunque en el reporte se mostrara en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas
        title={`Ventas por Mes Tiendas Plaza ${getPlazaName(paramTiendas.plaza)} a??o ${paramTiendas.delAgno} (mls.${paramTiendas.resultadosPesos ? "pesos" : "dlls"})`}
      >
        <BarChart
          text={`Ventas al ${formatLastDate(getPrevDate(0, paramTiendas.delAgno))}`}
          data={{
            labels,
            datasets
          }}
        />
      </ComparativoVentas>
    </>
  )
}

const TodasTiendasWithAuth = withAuth(TodasTiendas);
TodasTiendasWithAuth.getLayout = getVentasLayout;
export default TodasTiendasWithAuth;
