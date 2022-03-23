import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectPlazas, InputRangos, InputDateRange, Checkbox } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import PieChart from '../../components/Pie';
import { createRangoVentasDataset, getInitialPlaza, validateInputDateRange } from '../../utils/functions';
import { getBeginEndMonth } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getRangoVentasPlaza } from '../../services/RangoVentasService';
import { checkboxLabels } from '../../utils/data';

const Plaza = () => {
  const [labels, setLabels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(),
    fechaInicio: getBeginEndMonth(true)[0],
    fechaFin: getBeginEndMonth(true)[1],
    rangos: '100,200,300,400,500,600'
  })

  useEffect(() => {
    if (validateInputDateRange(paramPlaza.fechaInicio, paramPlaza.fechaFin)) {
      getRangoVentasPlaza(paramPlaza)
        .then(response => createRangoVentasDataset(response, setLabels, setDatasets))
    }
  }, [paramPlaza]);
  
  

  return (
    <>
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <SelectPlazas 
              value={paramPlaza.plaza}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <h2 className='my-2 font-bold'>Obtener Rangos de Ventas de las fechas:</h2>
            <InputDateRange 
              beginDate={paramPlaza.fechaInicio}
              endDate={paramPlaza.fechaFin}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <h2 className='my-2 font-bold'>Defina los rango requiridos:</h2>
            <InputRangos 
              value={paramPlaza.rangos}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <Checkbox
              className="mb-3"
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
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

      <ComparativoVentas title='Rangos de ventas por plaza'>
        <PieChart
          text='Rangos de ventas por plaza'
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
