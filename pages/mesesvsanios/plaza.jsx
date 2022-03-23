import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectMonth, SelectToMonth, InputToYear, InputYear, Checkbox, SelectPlazas } from '../../components/inputs';
import { checkboxLabels, inputNames } from '../../utils/data';
import BarChart from '../../components/BarChart';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { calculateCrecimiento, getInitialPlaza, validateMonthRange, validateYearRange } from '../../utils/functions';
import { formatLastDate, getCurrentMonth, getCurrentYear, getMonthByNumber, getPrevDate } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getMesesAgnosPlazas } from '../../services/MesesAgnosService';

const Plaza = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [parametrosPlazas, setParametrosPlazas] = useState({
    plaza: getInitialPlaza(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear() - 5,
    alAgno: getCurrentYear(),
    incluirTotal: 0,
    ventasDiaMesActual: 0,
    conIva: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 0,
    detalladoTienda: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateYearRange(parametrosPlazas.delAgno, parametrosPlazas.alAgno) && validateMonthRange(parametrosPlazas.delMes, parametrosPlazas.alMes)) {
      getMesesAgnosPlazas(parametrosPlazas)
        .then(response => createMesesAgnosPlazasDataset(response, parametrosPlazas.delAgno, parametrosPlazas.alAgno))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosPlazas]);

  const createMesesAgnosPlazasDataset = (data, fromYear, toYear) => {
    const colors = ['#006400', '#daa520', '#6495ed', '#ff7f50', '#98fb98'];

    if (data?.length !== 0) {
      let labels = [];

      if (parametrosPlazas.detalladoTienda === 1) {
        labels = data.map(item => item?.Descrip ? item.Descrip : item.DescCta);
      } else {
        labels = data.map(item => item?.Mes ? getMonthByNumber(item.Mes) : item.DescCta);
      }

      setLabels(labels);

      let datasets = [];
      let colorIndex = 0;
      let dataSetIndex = 1;
      for (let i = toYear; i >= fromYear; i--) {
        let ventas = data.map(item => item[`Ventas${i}`]);
        let ventasPrev = data.map(item => item[`Ventas${i - 1}`] ?? 0)

        datasets.push({
          id: dataSetIndex,
          label: `${i} ${calculateCrecimiento(ventas, ventasPrev)}%`,
          data: data.map(item => Math.floor(item[`Ventas${i}`])),
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
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas
              value={parametrosPlazas.plaza}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <SelectMonth
              value={parametrosPlazas.delMes}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <SelectToMonth
              value={parametrosPlazas.alMes}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <InputYear
              value={parametrosPlazas.delAgno}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <InputToYear
              value={parametrosPlazas.alAgno}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TOTAL}
              name={inputNames.INCLUIR_TOTAL}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
              name={inputNames.VENTAS_DIA_MES_ACTUAL}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <Checkbox
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => handleChange(e, setParametrosPlazas)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.DETALLADO_POR_TIENDA}
              name={inputNames.DETALLADO_TIENDA}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
            <Checkbox
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => { handleChange(e, setParametrosPlazas) }}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta grafica muestra las ventas de cada mes del año de la plaza seleccionada por cada uno de los años del rango especificado.
        </SmallContainer>
        <SmallContainer>
          Recuerde que el rango de años debe ser capturado de menor a el mayor, aunque en el reporte se mostrara en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas
        title={`Ventas Plaza del año ${parametrosPlazas.delAgno} al año ${parametrosPlazas.alAgno} 
        (mls.${parametrosPlazas.resultadosPesos === 1 ? "pesos." : "dlls."})`
        }>
        <BarChart
          text={`${parametrosPlazas.alMes === getCurrentMonth() ? `Ventas al ${formatLastDate(getPrevDate(0, parametrosPlazas.alAgno))}` : ""}`}
          data={{
            labels,
            datasets
          }}
        />
      </ComparativoVentas>
    </>
  )
}

Plaza.getLayout = getVentasLayout;

export default Plaza