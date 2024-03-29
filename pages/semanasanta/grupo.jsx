import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  Parameters,
  ParametersContainer,
} from "../../components/containers";
import {
  InputContainer,
  InputYear,
  Checkbox,
  InputVsYear,
  SelectTiendasGeneral,
} from "../../components/inputs";
import { VentasTableContainer } from "../../components/table";
import SemanaSantaTable from "../../components/table/SemanaSantaTable";
import { checkboxLabels, inputNames, MENSAJE_ERROR } from "../../utils/data";
import { getCurrentYear } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import {  validateYear } from "../../utils/functions";
import {
  getSemanaSantaGrupo,
  getSemanaSantaGrupoConcentrado,
} from "../../services/semanaSantaService";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Grupo = (props) => {
  const {config} = props;
  const sendNotification = useNotification()
  const [concentrado, setConcentrado] = useState(false);
  const [semanaSantaGrupo, setSemanaSantaGrupo] = useState({});
  
  const [paramGrupo, setParamGrupo] = useState({
    delAgno: getCurrentYear(),
    versusAgno: getCurrentYear() - 1,
    tiendas: 0,
    conIva: config?.conIva || 0,
    conVentasEventos: config?.conVentasEventos || 0,
    conTiendasCerradas: config?.conTiendasCerradasa || 0,
    incluirFinSemanaAnterior: config?.incluirFinSemanaAnterior || 0,
    resultadosPesos: config?.resultadosPesos || 0,
  });


  useEffect(() => {
    (async()=>{
      if( validateYear(paramGrupo.delAgno) && validateYear(paramGrupo.versusAgno)){
        if(concentrado){
          try {
            const response = await getSemanaSantaGrupoConcentrado(paramGrupo);
            setSemanaSantaGrupo(response);
          } catch (error) {
            sendNotification({
              type:'ERROR',
              message: error.response.data.message || error.message
            });
          }
        }else{
          try {
            const response = await getSemanaSantaGrupo(paramGrupo);
            setSemanaSantaGrupo(response);
          } catch (error) {
            sendNotification({
              type:'ERROR',
              message: error.response.data.message || error.message
            });
          }
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramGrupo]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas De Semana Santa del Año ${paramGrupo.delAgno}`}
      />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <InputYear
                value={paramGrupo.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
              <InputVsYear
                value={paramGrupo.versusAgno}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
              <SelectTiendasGeneral
                value={paramGrupo.tiendas}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.CONCENTRADO}
                checked={concentrado}
                onChange={() => {
                  setConcentrado((prev) => !prev);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                checked={paramGrupo.conIva}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                checked={paramGrupo.conVentasEventos}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
              <Checkbox
                className="mb-3"
                name={inputNames.CON_TIENDAS_CERRADAS}
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                checked={paramGrupo.conTiendasCerradas}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_FIN_DE_SEMANA_ANTERIOR}
                name={inputNames.INCLUIR_FIN_SEMANA_ANTERIOR}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.incluirFinSemanaAnterior}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => {
                  handleChange(e, setParamGrupo);
                }}
                checked={paramGrupo.resultadosPesos}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer
          title={`Ventas De Semana Santa del Año ${paramGrupo.delAgno}`}
        >
          {Object.keys(semanaSantaGrupo).map((key) => (
            <SemanaSantaTable
              key={key}
              title={key}
              ventas={semanaSantaGrupo[key]}
              year1={paramGrupo.delAgno}
              year2={paramGrupo.versusAgno}
            />
          ))}
        </VentasTableContainer>
      </section>
    </div>
  );
};

const GrupoWithAuth = withAuth(Grupo);
GrupoWithAuth.getLayout = getVentasLayout;
export default GrupoWithAuth;
