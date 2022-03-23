import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, InputDateRange, InputRangos, SelectTiendas, } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import PieChart from '../../components/Pie';
import { createRangoVentasDataset, getInitialTienda, validateInputDateRange } from '../../utils/functions';
import { getBeginEndMonth } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getRangoVentasTienda } from '../../services/RangoVentasService';

const Tienda = () => {
  const [datasets, setDatasets] = useState([]);
  const [labels, setLabels] = useState([]);
  const [paramTienda, setParamTienda] = useState({
    tienda: getInitialTienda(),
    fechaInicio: getBeginEndMonth(true)[0],
    fechaFin: getBeginEndMonth(true)[1],
    rangos: '100,200,300,400,500,600'
  });

  useEffect(() => {
    if (validateInputDateRange(paramTienda.fechaInicio, paramTienda.fechaFin)) {
      getRangoVentasTienda(paramTienda)
        .then(response => createRangoVentasDataset(response, setLabels, setDatasets));
    }
  }, [paramTienda]);
  
  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectTiendas
              value={paramTienda.tienda}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <h1>Obtener Rangos de Ventas de las fechas:</h1>
            <InputDateRange 
              beginDate={paramTienda.fechaInicio}
              endDate={paramTienda.fechaFin}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
            <InputRangos 
              value={paramTienda.rangos}
              onChange={(e) => { handleChange(e, setParamTienda) }}
            />
          </InputContainer>
        </Parameters> 
        <SmallContainer>
          ESTE REPORTE OBTIENE LOS RANGOS DE VENTA, DE LAS FECHAS ESTABLECIDAS. EL RANGO ESTABLEZCALO
        </SmallContainer>
        <SmallContainer>
          DE LA FORMA 1,150,250,350,400 QUE INDICA P.E. DEL 1 AL 149.00 DEL 150 AL 249.99.
        </SmallContainer>
      </ParametersContainer>

      <ComparativoVentas title='Rangos de ventas por Tienda'>
        <PieChart
          data={{
            labels,
            datasets
          }}
        />
      </ComparativoVentas>
    </>
  )
}

Tienda.getLayout = getVentasLayout;

export default Tienda
