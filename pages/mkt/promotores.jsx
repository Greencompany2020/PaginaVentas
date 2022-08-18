import { useState, useEffect, Fragment } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  InputContainer,
  Checkbox,
  SelectMonth,
  SelectToMonth,
  InputYear,
} from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableBody,
} from "../../components/table";
import {
  checkboxLabels,
  inputNames,
  MENSAJE_ERROR,
  meses,
} from "../../utils/data";
import { handleChange } from "../../utils/handlers";
import {
  getCurrentMonth,
  getCurrentYear,
  getMonthChars,
} from "../../utils/dateFunctions";
import {
  isError,
  validateMonthRange,
  validateYear,
} from "../../utils/functions";
import { getPromotores } from "../../services/MKTService";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Promotores = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [promotores, setPromotores] = useState({});
  const [paramPromotores, setParamPromotores] = useState({
    delMes: 1,
    alMes: getCurrentMonth() - 1,
    delAgno: getCurrentYear(),
    conIva: config?.conIva || 0
  });


  useEffect(() => {
    (async()=>{
      if( validateMonthRange(paramPromotores.delMes, paramPromotores.alMes) &&  validateYear(paramPromotores.delAgno)){
        try {
          const response = await getPromotores(paramPromotores);
          setPromotores(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramPromotores, paramPromotores.delAgno]);

  const createPromotoresTableHead = () => {
    return meses
      .slice(0, paramPromotores.alMes)
      .map((mes) => (
        <th key={mes.value}>{getMonthChars(mes.text).toUpperCase()}</th>
      ));
  };

  const createPromotoresTableRow = (plaza, data) => {
    return (
      <Fragment key={plaza}>
        <tr className="text-center font-bold border border-b-2">
          <th rowSpan={5} className="border border-l-2">
            {plaza}
          </th>
          <td>Ingresos</td>
          {Object.entries(data).map(([prop, value]) => (
            <Fragment key={prop}>
              <td>{value.ingresos}</td>
            </Fragment>
          ))}
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>% Particip.</td>
          {Object.entries(data).map(([prop, value]) => (
            <Fragment key={prop}>
              <td>{value.participacion}</td>
            </Fragment>
          ))}
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>Operaciones</td>
          {Object.entries(data).map(([prop, value]) => (
            <Fragment key={prop}>
              <td>{value.operaciones}</td>
            </Fragment>
          ))}
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>Puntos</td>
          {Object.entries(data).map(([prop, value]) => (
            <Fragment key={prop}>
              <td>{value.puntos}</td>
            </Fragment>
          ))}
        </tr>
        <tr className="text-center font-bold border border-b-2">
          <td>Canjes</td>
          {Object.entries(data).map(([prop, value]) => (
            <Fragment key={prop}>
              <td>{value.canjes}</td>
            </Fragment>
          ))}
        </tr>
      </Fragment>
    );
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title={`Ingresos Promotores ${paramPromotores.delAgno}`} />

      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectMonth
                value={paramPromotores.delMes}
                onChange={(e) => {
                  handleChange(e, setParamPromotores);
                }}
              />
              <SelectToMonth
                value={paramPromotores.alMes}
                onChange={(e) => {
                  handleChange(e, setParamPromotores);
                }}
              />
              <InputYear
                value={paramPromotores.delAgno}
                onChange={(e) => {
                  handleChange(e, setParamPromotores);
                }}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => {
                  handleChange(e, setParamPromotores);
                }}
                checked={paramPromotores.conIva}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable>
            <TableHead>
              <tr>
                <th>PLAZAS</th>
                <th>MESES</th>
                {createPromotoresTableHead()}
                <th>TOTAL</th>
              </tr>
            </TableHead>
            <TableBody>
              {Object.entries(promotores).map(([prop, data]) =>
                createPromotoresTableRow(prop, data)
              )}
            </TableBody>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const PromotoresWithAuth = withAuth(Promotores);
PromotoresWithAuth.getLayout = getVentasLayout;
export default PromotoresWithAuth;
