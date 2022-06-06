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
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Compromiso = () => {
  const alert = useAlert();
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

  useEffect(() => {
    if (
      validateInputDateRange(
        compromisosParametros.fechaInicio,
        compromisosParametros.fechaFin
      )
    ) {
      getSemanalesCompromisos(compromisosParametros).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setSemanalesCompromisos(response);
        }
      });
    }
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
      alert.showAlert("Promedio Actualizado", "info", 1500);

      const compromisos = await getSemanalesCompromisos(compromisosParametros);

      if (isError(compromisos)) {
        alert.showAlert(
          compromisos?.response?.data ?? MENSAJE_ERROR,
          "warning",
          1000
        );
      } else {
        setSemanalesCompromisos(compromisos);
      }
    } else {
      alert.showAlert("No se pudo actualizar", "warning", 1500);
    }
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport
        title={`DEFINICION METAS: Semana ${dateRangeTitle(
          compromisosParametros.fechaInicio,
          compromisosParametros.fechaFin
        )}`}
        description={`Este informe muestra un compartivo de la semana o en rango de fecha seleccionado. Recuerde que la comparacion se realiza lunes contra lunes,
            lo cual quiere decir que las ventas del año anterior no seran por fecha sino lo que corresponda a los dias de la semana.
          `}
      />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputContainer>
              <SelectPlazas
                classLabel="xl:text-center"
                onChange={(e) => handleChange(e, setCompromisosParametros)}
              />
            </InputContainer>
            <InputDateRange
              onChange={(e) => handleChange(e, setCompromisosParametros)}
              beginDate={compromisosParametros.fechaInicio}
              endDate={compromisosParametros.fechaFin}
            />
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
            </InputContainer>
            <InputContainer>
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
      <section className=" pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
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
                <th colSpan={2} className="border border-white bg-black-shape">
                  Venta
                </th>
                <th colSpan={2} className="border border-white bg-black-shape">
                  Promedios
                </th>
                <th
                  colSpan={2}
                  className="border border-white bg-black-shape rounded-tr-xl"
                >
                  Operaciones
                </th>
              </tr>
              <tr>
                <th colSpan={2} className="border border-white bg-black-shape">
                  Compromiso
                </th>
                <th colSpan={2} className="border border-white bg-black-shape">
                  Comp
                </th>
                <th colSpan={2} className="border border-white bg-black-shape">
                  Comp
                </th>
              </tr>
            </TableHead>
            <tbody className="bg-white">
              {semanalesCompromisos?.map((compromiso) => (
                <TableRow
                  key={compromiso.NoTienda}
                  rowId={compromiso.NoTienda}
                  className="text-right"
                >
                  <td
                    colSpan={2}
                    className="text-center bg-black text-white font-bold p-2"
                  >
                    {compromiso.Descrip}
                  </td>
                  <td>{numberWithCommas(compromiso.PresupuestoSem)}</td>
                  <td colSpan={2} className="pr-4">
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
                  <td colSpan={2} className="pr-4">
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
