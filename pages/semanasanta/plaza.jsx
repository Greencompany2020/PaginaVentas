import { useState, useEffect } from 'react';
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  SelectTiendasGeneral,
  SelectPlazas,
  InputYear,
  Checkbox,
} from "../../components/inputs";
import { VentasTableContainer } from "../../components/table";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import SemanaSantaTable from "../../components/table/SemanaSantaTable";
import MessageModal from '../../components/MessageModal';
import { getInitialPlaza, isError, validateYear } from '../../utils/functions';
import { getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { getSemanaSantaPlazas } from '../../services/semanaSantaService';
import useMessageModal from '../../hooks/useMessageModal';

const Plaza = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [semanaSantaPlazas, setSemanaSantaPlazas] = useState({});
  const [paramPlaza, setParamPlaza] = useState({
    plaza: getInitialPlaza(),
    tiendas: 0,
    delAgno: getCurrentYear(),
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    incluirFinSemanaAnterior: 1,
    resultadosPesos: 1
  });

  useEffect(() => {
    if (validateYear(paramPlaza.delAgno)) {
      getSemanaSantaPlazas(paramPlaza)
        .then(response => {

          if (isError(response)) {
            setMessage(response?.response?.data ?? MENSAJE_ERROR);
            setModalOpen(true);
          } else {
            setSemanaSantaPlazas(response)
          }
        })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPlaza]);

  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
          <SelectPlazas 
            value={paramPlaza.plaza}
            onChange={(e) => { handleChange(e, setParamPlaza) }}
          />
          <SelectTiendasGeneral 
            value={paramPlaza.tiendas}
            onChange={(e) => { handleChange(e, setParamPlaza) }}
          />
          <InputYear 
            value={paramPlaza.delAgno}
            onChange={(e) => { handleChange(e, setParamPlaza) }}
          />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className="mb-3"
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <Checkbox 
              className="mb-3"
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
            <Checkbox 
              className="mb-3"
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              name={inputNames.CON_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParamPlaza) }}
            />
          </InputContainer>
          <InputContainer>
          <Checkbox 
            className="mb-3"
            labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}
            name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}
            onChange={(e) => { handleChange(e, setParamPlaza) }}
            checked={paramPlaza.incluirFinSemanaAnterior}
          />
          <Checkbox 
            className="mb-3"
            labelText={checkboxLabels.RESULTADO_PESOS}
            name={inputNames.RESULTADOS_PESOS}
            onChange={(e) => { handleChange(e, setParamPlaza) }}
            checked={paramPlaza.resultadosPesos}
          />
          </InputContainer>
        </Parameters>
        <SmallContainer>
          ESTA GRAFICA MUESTRA LAS VENTAS DE CADA DIA DE SEMANA SANTA Y PASCUA DE LA PLAZA SELECCIONADA EN EL AÑO ESPECIFICADO.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title={`Ventas De Semana Santa del Año ${paramPlaza.delAgno}`}>
        {
          Object.keys(semanaSantaPlazas ?? {}).map(key => (
            <SemanaSantaTable key={key} title={key} ventas={semanaSantaPlazas[key]} year1={paramPlaza.delAgno} year2={paramPlaza.delAgno - 1} />
          ))
        }
      </VentasTableContainer>
    </>
  );
};

Plaza.getLayout = getVentasLayout;

export default Plaza;
