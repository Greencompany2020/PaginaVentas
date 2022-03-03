import { useState, useEffect, useCallback } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import BarChart from '../../components/BarChart';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectMonth, SelectTiendasGeneral, InputYear, Checkbox, InputToYear, SelectToMonth } from '../../components/inputs';
import { checkboxLabels, inputNames } from '../../utils/data';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { getCurrentMonth, getCurrentYear, getMonthByNumber } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getMesesAgnosGrupo } from '../../services/MesesAgnosService';

const Grupo = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [parametrosGrupo, setParametrosGrupo] = useState({
    delAgno: getCurrentYear() - 5,
    alAgno: getCurrentYear(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    tiendas: 0,
    incluirTotal: 0,
    ventasDiaMesActual: 0,
    conIva: 0,
    conVentasEventos: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
    sinTiendasSuspendidas: 0
  });

  useEffect(() => {
    if (validateYearRange(parametrosGrupo.delAgno, parametrosGrupo.alAgno) && validateMonthRange(parametrosGrupo.delMes, parametrosGrupo.alMes)) {
      getMesesAgnosGrupo(parametrosGrupo)
        .then(response => {
          createMesesAgnosGrupoDataset(response, parametrosGrupo.delAgno, parametrosGrupo.alAgno)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametrosGrupo]);

  const validateYearRange = (year1, year2) => {
    return (year1?.toString().length === 4 && year2?.toString().length === 4) && year1 < year2;
  }

  const validateMonthRange = (month1, month2) => (month1 <= month2) && (month1 !== 0 && month2 !== 0);

  const createMesesAgnosGrupoDataset = (data, fromYear, toYear) => {
    const colors = ['#006400', '#daa520', '#6495ed', '#ff7f50', '#98fb98'];

    if (data?.length !== 0) {
      let labels = [];
      labels = data.map(item => item?.Mes ? getMonthByNumber(item.Mes) : item.titulo);
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

  /**
   * 
   * @param {number[]} dataList1 
   * @param {number[]} dataList2 
   */
  const calculateCrecimiento = (dataList1, dataList2) => {
    const sumTotal = dataList1.reduce((acc, curr) => acc + curr);
    const sumTotalPrev = dataList2.reduce((acc, curr) => acc + curr);

    const porcentaje = calculatePromedio(sumTotal, sumTotalPrev);

    return porcentaje;
  }

  const calculatePromedio = (total1, total2) => {
    if (total2 === 0) return 0;
    return ((total1 / total2 - 1) * 100).toFixed(1);
  }

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear
              value={parametrosGrupo.delAgno}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <InputToYear
              value={parametrosGrupo.alAgno}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <SelectMonth
              value={parametrosGrupo.delMes}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <SelectToMonth
              value={parametrosGrupo.alMes}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <SelectTiendasGeneral />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TOTAL}
              name={inputNames.INCLUIR_TOTAL}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_AL_DIA_MES_ACTUAL}
              name={inputNames.VENTAS_DIA_MES_ACTUAL}
              onChange={(e) => handleChange(e, setParametrosGrupo)}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
              name={inputNames.SIN_AGNO_VENTA}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
              name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
              onChange={(e) => { handleChange(e, setParametrosGrupo) }}
            />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta gráfica muestra las ventas anuales del grupo para cada uno de los años del rango especificado.
        </SmallContainer>
        <SmallContainer>
          Recuerde que el rango de años debe ser capturado de el menor a el mayor aunque en el reporte se mostrará en orden descendente.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title='Comparativo de ventas del año 2017 al año 2021 (mls.dlls) -iva no incluido'>
        <BarChart
          text='Comparativo de ventas del año 2017 al año 2021 (mls.dlls) -iva no incluido'
          data={{
            labels,
            datasets
          }}
        />
      </ComparativoVentas>
    </>
  )
}

Grupo.getLayout = getVentasLayout;

export default Grupo
