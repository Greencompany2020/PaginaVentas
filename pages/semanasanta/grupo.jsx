import { useState, useEffect } from 'react';
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
  SmallContainer,
} from "../../components/containers";
import {
  InputContainer,
  InputYear,
  Checkbox,
  InputVsYear,
  SelectTiendasGeneral,
} from "../../components/inputs";
import { VentasTableContainer } from "../../components/table";
import { MessageModal } from '../../components/modals';
import SemanaSantaTable from "../../components/table/SemanaSantaTable";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import { getCurrentYear } from '../../utils/dateFunctions';
import { handleChange } from '../../utils/handlers';
import { isError, validateYear } from '../../utils/functions';
import { getSemanaSantaGrupo, getSemanaSantaGrupoConcentrado } from '../../services/semanaSantaService';
import useMessageModal from '../../hooks/useMessageModal';
import withAuth from '../../components/withAuth';



const Grupo = () => {
  const { message, modalOpen, setMessage, setModalOpen } = useMessageModal();
  const [concentrado, setConcentrado] = useState(false);
  const [semanaSantaGrupo, setSemanaSantaGrupo] = useState({});
  const [paramGrupo, setParamGrupo] = useState({
    delAgno: getCurrentYear(),
    versusAgno: getCurrentYear() - 1,
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    incluirFinSemanaAnterior: 1,
    resultadosPesos: 1
  });
  
  useEffect(() => {
    if (validateYear(paramGrupo.delAgno) && validateYear(paramGrupo.versusAgno)) {
      if (concentrado) {
        getSemanaSantaGrupoConcentrado(paramGrupo)
          .then(response => {

            if (isError(response)) {
              setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
              setModalOpen(true);
            } else {
              setSemanaSantaGrupo(response)
            }
          });
      } else {
        getSemanaSantaGrupo(paramGrupo)
          .then(response => {

            if (isError(response)) {
              setMessage(response?.response?.data?.message ?? MENSAJE_ERROR);
              setModalOpen(true);
            } else {
              setSemanaSantaGrupo(response)
            }
          });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramGrupo, concentrado]);
  
  return (
    <>
      <MessageModal message={message} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      <ParametersContainer>
        <Parameters>
          <InputContainer>
            <InputYear 
              value={paramGrupo.delAgno} 
              onChange={(e) => { handleChange(e, setParamGrupo) }} 
            />
            <InputVsYear 
              value={paramGrupo.versusAgno}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <SelectTiendasGeneral 
              value={paramGrupo.tiendas}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className="mb-3" 
              labelText={checkboxLabels.CONCENTRADO}
              onChange={() => { setConcentrado(prev => !prev) }}
            />
            <Checkbox 
              className="mb-3" 
              labelText={checkboxLabels.VENTAS_IVA}
              name={inputNames.CON_IVA}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox
              className="mb-3"
              labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS} 
              name={inputNames.CON_VENTAS_EVENTOS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
            <Checkbox
              className="mb-3"
              labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
            />
          </InputContainer>
          <InputContainer>
            <Checkbox 
              className="mb-3"
              labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR} 
              name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
              checked={paramGrupo.incluirFinSemanaAnterior}
            />
            <Checkbox
              className="mb-3"
              labelText={checkboxLabels.PERIODO_COMPLETO}
              onChange={() => {}}
            />
            <Checkbox 
              labelText={checkboxLabels.RESULTADO_PESOS}
              name={inputNames.RESULTADOS_PESOS}
              onChange={(e) => { handleChange(e, setParamGrupo) }}
              checked={paramGrupo.resultadosPesos}
            />
          </InputContainer>
          <InputContainer>
          </InputContainer>
        </Parameters>
        <SmallContainer>
          Esta tabla muestra las ventas del día por día del mes y año
          especificado.
        </SmallContainer>
      </ParametersContainer>

      <VentasTableContainer title={`Ventas De Semana Santa del Año ${paramGrupo.delAgno}`}>
        {
          Object.keys(semanaSantaGrupo).map(key => 
            <SemanaSantaTable key={key} title={key} ventas={semanaSantaGrupo[key]} year1={paramGrupo.delAgno} year2={paramGrupo.versusAgno} />
          )
        }
      </VentasTableContainer>
    </>
  );
};

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;