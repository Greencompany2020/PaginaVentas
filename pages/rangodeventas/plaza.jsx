import { useState, useEffect } from 'react';
import { getVentasLayout } from '../../components/layout/VentasLayout';
import { Parameters, ParametersContainer, SmallContainer } from '../../components/containers';
import { InputContainer, SelectPlazas, InputRangos, InputDateRange, Checkbox } from '../../components/inputs';
import ComparativoVentas from '../../components/table/ComparativoVentas';
import PieChart from '../../components/Pie';
import { getInitialPlaza, validateInputDateRange } from '../../utils/functions';
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
        .then(response => createRangoVentasDataset(response))
    }
  }, [paramPlaza]);
  
  const createRangoVentasDataset = (data) => {
    const bgColors = [
      'rgba(255, 100, 94, 0.5)',
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(0, 128, 128, 0.2)',
      'rgba(106, 90, 205, 0.2)',
      'rgba(205, 133, 63, 0.2)',
      'rgba(107, 142, 35, 0.2)',
    ];

    const borderColor = [
      'rgba(255, 100, 94, 1)',
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(0, 128, 128, 1)',
      'rgba(106, 90, 205, 1)',
      'rgba(205, 133, 63, 1)',
      'rgba(107, 142, 35, 1)',
    ]

    if (data && data?.length !== 0) {
      const labels = [];
      const rangosVentas = [];

      labels = data?.map((rango) => rango.rango);

      let dataItem = {
        data: data?.map((rango) => rango.venta),
        backgroundColor: bgColors.slice(0, data?.length),
        borderColor: borderColor.slice(0, data?.length),
        borderWidth: 1
      }

      rangosVentas.push(dataItem)

      setLabels(labels);
      setDatasets(rangosVentas);
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
