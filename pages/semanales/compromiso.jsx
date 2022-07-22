import { useState, useEffect } from "react";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import { ParametersContainer, Parameters } from "../../components/containers";
import {
  InputContainer,
  InputDateRange,
  SelectPlazas,
  Checkbox,
} from "../../components/inputs";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
  TableRow,
} from "../../components/table";
import { checkboxLabels, MENSAJE_ERROR } from "../../utils/data";
import {
  getSemanalesCompromisos,
  updateSemalesCompromisos,
} from "../../services/SemanalesService";
import { numberWithCommas } from "../../utils/resultsFormated";
import { getCurrentWeekDateRange } from "../../utils/dateFunctions";
import {
  dateRangeTitle,
  isError,
  validateInputDateRange,
} from "../../utils/functions";
import { inputNames } from "../../utils/data/checkboxLabels";
import { handleChange } from "../../utils/handlers";
import withAuth from "../../components/withAuth";
import TitleReport from "../../components/TitleReport";
import { useNotification } from "../../components/notifications/NotificationsProvider";

const Compromiso = (props) => {
  const {config} = props;
  const sendNotification = useNotification();
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [semanalesCompromisos, setSemanalesCompromisos] = useState([]);
  const [compromisosParametros, setCompromisosParametros] = useState({
    fechaInicio: beginDate,
    fechaFin: endDate,
    plaza: 3,
    conIva: 0,
    sinAgnoVenta: 0,
    conTiendasCerradas: 0,
  });

  useEffect(()=>{
    setCompromisosParametros(prev => ({
      ...prev,
      conIva:config.conIva || 0,
      sinAgnoVenta:config.sinAgnoVenta || 0,
      conTiendasCerradas:config.conTiendasCerradas || 0,
    }))
  },[config])

  useEffect(() => {
    (async()=>{
      if (validateInputDateRange(compromisosParametros.fechaInicio,compromisosParametros.fechaFin)){
        try {
          const response = await getSemanalesCompromisos(compromisosParametros);
          setSemanalesCompromisos(response);
        } catch (error) {
          sendNotification({
            type:'ERROR',
            message: MENSAJE_ERROR
          });
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compromisosParametros]);

  const handleUpdatePromedio = (tienda, promedio) => {
    setSemanalesCompromisos((current) =>
      current.map((compromiso) => {
        if (compromiso.NoTienda === tienda)
          return { ...compromiso, Promedio: parseInt(promedio, 10) };
        return compromiso;
      })
    );
  };

  const handleSubmitPromedios = async () => {
    const promedios = semanalesCompromisos.map((tiendaComp) => ({
      promedio: tiendaComp.Promedio,
      tienda: tiendaComp.NoTienda,
    }));

    const updatePromedios = {
      empresa: compromisosParametros.plaza,
      fechaInicio: compromisosParametros.fechaInicio,
      fechaFin: compromisosParametros.fechaFin,
      nuevosPromedios: promedios,
    };

    const result = await updateSemalesCompromisos(updatePromedios);

    if (result) {
      sendNotification({
        type:'OK',
        message:'Promedio Actualizado'
      });
      const compromisos = await getSemanalesCompromisos(compromisosParametros);
      if (isError(compromisos)) {
        sendNotification({
          type:'ERROR',
          message: compromisos?.response?.data ?? MENSAJE_ERROR
        });
      } else {
        setSemanalesCompromisos(compromisos);
      }
    } else {
      sendNotification({
        type:'ERROR',
        message:'No se pudo actualizar'
      });
    }
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`DEFINICION METAS: Semana ${dateRangeTitle(
          compromisosParametros.fechaInicio,
          compromisosParametros.fechaFin
        )}`}
      />
      <section className="p-4 flex flex-row justify-between items-baseline">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                classLabel="xl:text-center"
                onChange={(e) => handleChange(e, setCompromisosParametros)}
              />
              <InputDateRange
                onChange={(e) => handleChange(e, setCompromisosParametros)}
                beginDate={compromisosParametros.fechaInicio}
                endDate={compromisosParametros.fechaFin}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setCompromisosParametros)}
              />
              <Checkbox
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
              />
               <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setCompromisosParametros)}
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
                <th
                  rowSpan={2}
                  className="border border-white bg-black-shape rounded-tl-xl"
                >
                  Tienda
                </th>
                <th colSpan={1} className="border border-white bg-black-shape">
                  Venta
                </th>
                <th colSpan={1} className="border border-white bg-black-shape">
                  Promedios
                </th>
                <th
                  colSpan={1}
                  className="border border-white bg-black-shape rounded-tr-xl"
                >
                  Operaciones
                </th>
              </tr>
              <tr>
                <th colSpan={1} className="border border-white bg-black-shape text-right">
                  Compromiso
                </th>
                <th colSpan={1} className="border border-white bg-black-shape text-right">
                  Comp
                </th>
                <th colSpan={1} className="border border-white bg-black-shape text-right">
                  Comp
                </th>
              </tr>
            </TableHead>
            <tbody className="bg-white">
              {semanalesCompromisos?.map((compromiso) => (
                <TableRow
                  key={compromiso.NoTienda}
                  rowId={compromiso.NoTienda}
                  className="text-center"
                >
                  <td colSpan={1} className="text-black text-xs font-bold p-2 text-left">
                    {compromiso.Descrip}
                  </td>
                  <td className="text-right text-xs">
                    {numberWithCommas(compromiso.PresupuestoSem)}
                  </td>
                  <td colSpan={1} className="pr-4 text-right">
                    <input
                      type="text"
                      value={compromiso.Promedio}
                      className="w-16 outline-none bg-gray-200 text-right rounded-md pr-2"
                      onChange={(e) =>
                        handleUpdatePromedio(
                          compromiso.NoTienda,
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td colSpan={1} className="pr-4 text-right">
                    <input
                      type="text"
                      value={compromiso.OperacionesSem}
                      className="w-16 outline-none bg-gray-200 text-right rounded-md pr-2"
                      onChange={() => {}}
                    />
                  </td>
                </TableRow>
              ))}
            </tbody>
          </VentasTable>
          <div className="pt-4">
            <button
              className="blue-button text-white"
              onClick={handleSubmitPromedios}
            >
              Grabar
            </button>
          </div>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const CompromisoWithAuth = withAuth(Compromiso);
CompromisoWithAuth.getLayout = getVentasLayout;
export default CompromisoWithAuth;
