import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectMonth, SelectToMonth, InputYear, SelectTiendasGeneral, Checkbox } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import { checkboxLabels, inputNames, meses } from '../../utils/data';
import { getCurrentMonth, getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import BarChart from '../../components/BarChart';
import { validateYear } from '../../utils/functions';
import { getPresupuestoGrupo } from '../../services/PresupuestoService';

const Grupo = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [paramGrupo, setParamGrupo] = useState({
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    tiendas: 0,
    acumulado: 0,
    total: 0,
    conIva: 0,
    porcentajeVentasCompromiso: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    resultadosPesos: 0
  });

  useEffect(() => {
    if (validateYear(paramGrupo.delAgno) && paramGrupo.delAgno > 0 && paramGrupo.alMes > 0) {
      getPresupuestoGrupo(paramGrupo)
        .then(response => createPresupuestoGrupoDatasets(response));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramGrupo]);

  const createPresupuestoGrupoDatasets = (data) => {
    const colors = ['#F43F5E', '#EA580C', '#0284C7'];

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
        label: `Ventas ${paramGrupo.delAgno}`,
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
        label: `Ventas ${paramGrupo.delAgno - 1}`,
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
              value={paramGrupo.delMes}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <SelectToMonth
              value={paramGrupo.alMes}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <InputYear
              value={paramGrupo.delAgno}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <SelectTiendasGeneral
              value={paramGrupo.tiendas}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox
            className='mb-3'
            labelText={checkboxLabels.ACUMULATIVA}
            name={inputNames.ACUMULATIVA}
            onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.GRAFICAR_TOTAL}
              name={inputNames.GRAFICAR_TOTAL}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.PORCENTAJE_VENTAS_VS_COMPROMISO}
              name={inputNames.PORCENTAJE_COMPROMISO}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox
              className='mb-3'
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox 
              className='mb-3'
              labelText={checkboxLabels.RESULTADO_PESOS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
          </InputContainer>
        </Parameters>   
          <SmallContainer>
          Esta grafica muestra las ventas vs. compromiso del grupo en el periodo de meses y 
        </SmallContainer>
          <SmallContainer>
          el año especificado,este siempre será comparado contra el año anterior.        
          </SmallContainer>

      </ParametersContainer>

      <ComparativoVentas title={`Ventas vs. Compromiso del Grupo del año ${paramGrupo.delAgno}`}>
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

Grupo.getLayout = getVentasLayout;

export default Grupo;
