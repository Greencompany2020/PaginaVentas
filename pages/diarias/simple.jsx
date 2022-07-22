import { useEffect, useState } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import {
  SelectTiendas,
  SelectMonth,
  InputYear,
  InputContainer,
  Checkbox,
} from "../../components/inputs";
import { checkboxLabels, MENSAJE_ERROR } from "../../utils/data";
import { getDiariasTiendaSimple } from "../../services/DiariasServices";
import {
  getInitialTienda,
  getLastTwoNumbers,
  getTiendaName,
} from "../../utils/functions";
import { numberWithCommas } from "../../utils/resultsFormated";
import { getMonthByNumber } from "../../utils/dateFunctions";
import { handleChange } from "../../utils/handlers";
import withAuth from "../../components/withAuth";
import { useAuth } from "../../context/AuthContext";
import TitleReport from "../../components/TitleReport";
import {useNotification} from '../../components/notifications/NotificationsProvider';

const Simple = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const { tiendas } = useAuth();
  const [tiendaSimple, setTiendaSimple] = useState([]);
  const [tiendaSimpleParametros, setTiendaSimpleParametros] = useState({
    delMes: new Date(Date.now()).getMonth() + 1,
    delAgno: new Date(Date.now()).getFullYear(),
    tienda: getInitialTienda(tiendas),
    conIva: 0,
  });

  useEffect(()=>{
    if(tiendas){
      setTiendaSimpleParametros(prev => ({...prev, 
        tienda:getInitialTienda(tiendas),
        conIva: config.conIva || 0,
      }));
    }
  },[tiendas, config]);

  useEffect(() => {
      (async ()=>{
        if(tiendas){
          try {
            const response = await getDiariasTiendaSimple(tiendaSimpleParametros);
            setTiendaSimple(response);
          } catch (error) {
            sendNotification({
              type:'ERROR',
              message:response?.response?.data ?? MENSAJE_ERROR
            });
          }
        }
      })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendaSimpleParametros, tiendaSimpleParametros.delAgno]);

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`Ventas Diarias ${getTiendaName(
          tiendaSimpleParametros.tienda
        )} ${getMonthByNumber(tiendaSimpleParametros.delMes)} ${
          tiendaSimpleParametros.delAgno
        }`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectTiendas
                value={tiendaSimpleParametros.tienda}
                onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
              />
              <div className="flex items-center space-x-1">
                <div className="flex-1">
                  <InputYear
                    value={tiendaSimpleParametros.delAgno}
                    onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
                  />
                </div>
                <div className="flex-1">
                  <SelectMonth
                    value={tiendaSimpleParametros.delMes}
                    onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
                  />
                </div>
              </div>
             
              <Checkbox
                className="mb-2"
                labelText={checkboxLabels.VENTAS_IVA}
                checked={tiendaSimpleParametros.conIva ? true : false}
                name="conIva"
                onChange={(e) => handleChange(e, setTiendaSimpleParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="p-4 overflow-y-auto">
        <VentasTableContainer>
          <VentasTable>
            <TableHead>
              <tr>
                <th
                  colSpan={2}
                  className="border border-white bg-black-shape rounded-tl-xl"
                >
                  Dia
                </th>
                <th
                  colSpan={3}
                  className="border border-white bg-black-shape  rounded-tr-xl"
                >
                  Venta por Dia
                </th>
              </tr>
              <tr>
                <th className="border border-white bg-black-shape text-right">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno)}
                </th>
                <th className="border border-white bg-black-shape text-right">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno - 1)}
                </th>
                <th className="border border-white bg-black-shape text-right">
                  {tiendaSimpleParametros.delAgno}
                </th>
                <th className="border border-white bg-black-shape text-right">
                  {tiendaSimpleParametros.delAgno - 1}
                </th>
                <th className="border border-white bg-black-shape text-right">Acum</th>
              </tr>
            </TableHead>
            <tbody className="bg-white text-right">
              {
                (()=>{
                  if(tiendaSimple.length > 0){
                    const Items = tiendaSimple?.map((ventas) => (
                      <TableRow key={ventas.dia} rowId={ventas.dia}>
                        <td className="text-xs font-bold">{ventas.dia}</td>
                        <td className="text-xs">{ventas.dia}</td>
                        <td className="text-xs font-bold">
                          {numberWithCommas(ventas.ventaActual)}
                        </td>
                        <td className="text-xs">
                          {numberWithCommas(ventas.ventaAnterior)}
                        </td>
                        <td className="text-xs font-bold">
                          {numberWithCommas(ventas.acumulado)}
                        </td>
                      </TableRow>
                    ));
                    return Items;
                  }
                  return <></>
                })()
              }
            </tbody>
            <tfoot className=" text-white text-center text-xs font-bold">
              <tr>
                <th className="border border-white bg-black text-right">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno)}
                </th>
                <th className="border border-white bg-black text-right">
                  {getLastTwoNumbers(tiendaSimpleParametros.delAgno - 1)}
                </th>
                <th className="border border-white bg-black text-right">
                  {tiendaSimpleParametros.delAgno}
                </th>
                <th className="border border-white bg-black text-right">
                  {tiendaSimpleParametros.delAgno - 1}
                </th>
                <th className="border border-white bg-black text-right">Acum</th>
              </tr>
              <tr>
                <th
                  colSpan={2}
                  className="border border-white bg-black rounded-bl-xl"
                >
                  Dia
                </th>
                <th
                  colSpan={3}
                  className="border border-white bg-black rounded-br-xl"
                >
                  Venta por Dia
                </th>
              </tr>
            </tfoot>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const SimpleWithAuth = withAuth(Simple);
SimpleWithAuth.getLayout = getVentasLayout;
export default SimpleWithAuth;
