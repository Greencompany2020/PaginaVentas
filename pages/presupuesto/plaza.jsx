import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectMonth, SelectToMonth, InputYear, SelectPlazas, Checkbox } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { checkboxLabels, inputNames, meses } from '../../utils/data';
import BarChart from '../../components/BarChart';
import { getInitialPlaza, getPlazaName, validateYear } from '../../utils/functions';
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getPresupuestoPlazas } from '../../services/PresupuestoService';

const Plaza = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [paramPlazas, setParamPlazas] = useState({
    plaza: getInitialPlaza(),
    delAgno: getCurrentYear(),
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    acumulado: 0,
    total: 0,
    conIva: 0,
    porcentajeVentasCompromiso: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateYear(paramPlazas.delAgno)) {
      getPresupuestoPlazas(paramPlazas)
        .then(response => createPresupuestoPlazaDatasets(response))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPlazas]);

  const createPresupuestoPlazaDatasets = (data) => {
    const colors = ['#047857', '#0E7490', '#1D4ED8'];

    if (data?.length !== 0) {
      const labels = [];
      const ventasDataset = [];

      const ventasActual = data?.map((venta) => venta.ventaActual);
      const presupuestos = data?.map((venta) => venta.presupuesto);
      const ventasAnterior = data?.map((venta) => venta.ventaAnterior);

      for (let venta of data) {
        const month = meses.find((mes) => mes.value === venta.mes)?.text ?? "ACUM";

        const label = `${month} ${venta.porcentaje}%`;

        labels.push(label);
      }

      const ventasActualesData = {
        label: `Ventas ${paramPlazas.delAgno}`,
        data: ventasActual,
        backgroundColor: colors[0]
      };

      ventasDataset.push(ventasActualesData);

      const presupuesto = {
        label: 'Presupuesto',
        data: presupuestos,
        backgroundColor: colors[1]
      };
      ventasDataset.push(presupuesto);

      const ventasAnteriorData = {
        label: `Ventas ${paramPlazas.delAgno - 1}`,
        data: ventasAnterior,
        backgroundColor: colors[2]
      };

      ventasDataset.push(ventasAnteriorData)

      setDatasets(ventasDataset)
      setLabels(labels);
    } else {
      setDatasets([]);
      setLabels([]);
    }
  }

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectMonth
              value={paramPlazas.delMes}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <SelectToMonth
              value={paramPlazas.alMes}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <InputYear
              value={paramPlazas.delAgno}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
          </InputContainer>
          <InputContainer>
            <SelectPlazas
              value={paramPlazas.plaza}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.ACUMULATIVA}
              name={inputNames.ACUMULATIVA}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.GRAFICAR_TOTAL}
              name={inputNames.GRAFICAR_TOTAL}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_COMPROMISO}
              name={inputNames.PORCENTAJE_COMPROMISO}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => { handleChange(e, setParamPlazas) }}
            />
          </InputContainer>
        </Parameters>   
          <SmallContainer>
        Esta grafica muestra un comparativo de las ventas vs compromiso del grupo en el periodo de meses y
        </SmallContainer>
          <SmallContainer>
        el año especificado, este siempre será comparado contra el año anterior.
        </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title={`Ventas por Mes Tiendas Plaza ${getPlazaName(paramPlazas.plaza)} año ${paramPlazas.delAgno}`}>
        <BarChart
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
