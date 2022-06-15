import { useState, useEffect } from "react";
import {
  SmallContainer,
  ParametersContainer,
  Parameters,
} from "../../components/containers";
import { getVentasLayout } from "../../components/layout/VentasLayout";
import {
  VentasTableContainer,
  VentasTable,
  TableHead,
} from "../../components/table";
import {
  InputContainer,
  InputDateRange,
  Checkbox,
  SelectTiendasGeneral,
} from "../../components/inputs";
import { MessageModal } from "../../components/modals";
import RegionesPlazaTableRow from "../../components/table/RegionesPlazaTableRow";
import {
  regiones,
  checkboxLabels,
  plazas,
  MENSAJE_ERROR,
} from "../../utils/data";
import {
  getCurrentWeekDateRange,
  getYearFromDate,
} from "../../utils/dateFunctions";
import {
  dateRangeTitle,
  isError,
  validateInputDateRange,
} from "../../utils/functions";
import { getSemanalesTiendas } from "../../services/SemanalesService";
import { inputNames } from "../../utils/data/checkboxLabels";
import { handleChange } from "../../utils/handlers";
import withAuth from "../../components/withAuth";
import { useAlert } from "../../context/alertContext";
import TitleReport from "../../components/TitleReport";

const Tiendas = () => {
  const alert = useAlert();
  const [beginDate, endDate] = getCurrentWeekDateRange();
  const [semanalesTienda, setSemanalesTienda] = useState([]);
  const [tiendasParametros, setTiendasParametros] = useState({
    fechaInicio: beginDate,
    fechaFin: endDate,
    tiendas: 0,
    conIva: 0,
    conVentasEventos: 0,
    conTiendasCerradas: 0,
    sinAgnoVenta: 0,
    sinTiendasSuspendidas: 0,
    resultadosPesos: 0,
  });

  useEffect(() => {
    if (
      validateInputDateRange(
        tiendasParametros.fechaInicio,
        tiendasParametros.fechaFin
      )
    ) {
      getSemanalesTiendas(tiendasParametros).then((response) => {
        if (isError(response)) {
          alert.showAlert(
            response?.response?.data ?? MENSAJE_ERROR,
            "warning",
            1000
          );
        } else {
          setSemanalesTienda(response);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiendasParametros]);

  const renderRow = (item, isLast = false) => {
    if (plazas.findIndex((plaza) => plaza.text === item.plaza) !== -1) {
      return (
        <RegionesPlazaTableRow
          item={item}
          type="plaza"
          key={item.plaza}
          rowId={item.plaza}
          isLast = {isLast}
        />
      );
    }
    if (regiones.includes(item.plaza)) {
      return (
        <RegionesPlazaTableRow
          item={item}
          type="region"
          key={item.plaza}
          rowId={item.plaza}
          isLast = {isLast}
        />
      );
    }
    return (
      <RegionesPlazaTableRow item={item} key={item.plaza} rowId={item.plaza} isLast = {isLast}/>
    );
  };

  return (
    <div className=" flex flex-col h-full">
      <TitleReport title="Detalles de información / Semanales por Tienda" />
      <section className="pt-4 pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16">
        <ParametersContainer>
          <Parameters>
            <InputDateRange
              beginDate={tiendasParametros.fechaInicio}
              endDate={tiendasParametros.fechaFin}
              onChange={(e) => handleChange(e, setTiendasParametros)}
            />
            <InputContainer>
              <SelectTiendasGeneral
                value={tiendasParametros.tiendas}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.VENTAS_IVA}
                name={inputNames.CON_IVA}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_VENTAS_EVENTOS}
                name={inputNames.CON_VENTAS_EVENTOS}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.INCLUIR_TIENDAS_CERRADAS}
                name={inputNames.CON_TIENDAS_CERRADAS}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_SIN_AGNO_VENTAS}
                name={inputNames.SIN_AGNO_VENTA}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
            </InputContainer>
            <InputContainer>
              <Checkbox
                className="mb-3"
                labelText={checkboxLabels.EXCLUIR_TIENDAS_SUSPENDIDAS}
                name={inputNames.SIN_TIENDAS_SUSPENDIDAS}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
              <Checkbox
                labelText={checkboxLabels.RESULTADO_PESOS}
                name={inputNames.RESULTADOS_PESOS}
                onChange={(e) => handleChange(e, setTiendasParametros)}
              />
            </InputContainer>
          </Parameters>
        </ParametersContainer>
      </section>
      <section className="pl-4 pr-4 md:pl-8 md:pr-8 xl:pl-16 xl:pr-16 pb-4 overflow-y-auto ">
        <VentasTableContainer>
          <VentasTable className="tfooter">
            <TableHead>
              <tr>
                <td
                  rowSpan={3}
                  className="border border-white bg-black-shape rounded-tl-xl"
                >
                  Plaza
                </td>
                <td
                  colSpan={15}
                  className="border border-white bg-black-shape rounded-tr-xl"
                >
                  {dateRangeTitle(
                    tiendasParametros.fechaInicio,
                    tiendasParametros.fechaFin
                  )}
                </td>
              </tr>
              <tr className="text-right">
                <td rowSpan={2} className="border border-white bg-black-shape">
                  Comp
                </td>
                <td rowSpan={2} className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin)}
                </td>
                <td rowSpan={2} className="border border-white bg-black-shape">
                  %
                </td>
                <td rowSpan={2} className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin) - 1}
                </td>
                <td colSpan={4} className="border border-white bg-black-shape">
                  operaciones
                </td>
                <td colSpan={4} className="border border-white bg-black-shape">
                  promedios
                </td>
                <td colSpan={3} className="border border-white bg-black-shape">
                  Articulos Prom.
                </td>
              </tr>
              <tr className="text-right">
                <td className="border border-white bg-black-shape">Comp</td>
                <td className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin)}
                </td>
                <td className="border border-white bg-black-shape">%</td>
                <td className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin) - 1}
                </td>
                <td className="border border-white bg-black-shape">comp</td>
                <td className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin)}
                </td>
                <td className="border border-white bg-black-shape">%</td>
                <td className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin) - 1}
                </td>
                <td className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin)}
                </td>
                <td className="border border-white bg-black-shape">%</td>
                <td className="border border-white bg-black-shape">
                  {getYearFromDate(tiendasParametros.fechaFin) - 1}
                </td>
              </tr>
            </TableHead>
            <tbody className="bg-white text-xs text-right">
              {
                (() => {
                  if(semanalesTienda.length > 0){
                    const count = semanalesTienda.length - 1;
                    const Items = semanalesTienda?.map((tienda, index) => renderRow(tienda, count == index))
                    return Items;
                  }
                })()
              }
            </tbody>
          </VentasTable>
        </VentasTableContainer>
      </section>
    </div>
  );
};

const TiendasWithAuth = withAuth(Tiendas);
TiendasWithAuth.getLayout = getVentasLayout;
export default TiendasWithAuth;
