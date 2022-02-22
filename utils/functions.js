import { plazas, tiendas } from "./data";
import { getMonthByNumber, getMonthChars } from "./dateFunctions";

/**
 * Obtiene el nombre de la tienda a partir del identificador de la misma.
 * @param {number} tiendaId 
 * @returns {string} 
 */
export const getTiendaName = (tiendaId) => {
  const tienda = tiendas.find((tienda) => tienda.value === tiendaId);
  return tienda?.text;
}
/**
 * Obtiene el nomber de la plaza en base al identificador de la misma.
 * @param {number} plazaId 
 * @returns 
 */
export const getPlazaName = (plazaId) => {
  const plaza = plazas.find((plaza) => plaza.value === plazaId);
  return plaza?.text;
}
/**
 * Obtiene los 2 últimos dígitos del años. Ej.
 * 
 * 2021 -> 21
 * 
 * @param {number} date El año
 * @returns {string} String con los 2 dígitos.
 */
export const getLastTwoNumbers = (date) => {
  return date?.toString().slice(2);
}
/**
 * Crear un texto de título a partir del rango de fechas ingresado. Ej.
 * 
 * beginDate: 2022-02-14
 * 
 * endDate: 2022-02-20
 * 
 * string: del 14 de Feb del 2022 Al 20 de Feb del 2022
 * 
 * 
 * @param {string} beginDate Fecha de inicio de rango
 * @param {string} endDate Fecha de fin de rango
 * @returns {string}
 */
export const dateRangeTitle = (beginDate, endDate) => {
  let beginTextDate = "";
  let endTextDate = "";

  let beginDateParts = beginDate.split("-");
  let endDateParts = endDate.split("-");

  let beginMonth = getMonthByNumber(beginDateParts[1]);
  beginMonth = getMonthChars(beginMonth);

  let endMonth = getMonthByNumber(endDateParts[1]);
  endMonth = getMonthChars(endMonth);

  beginTextDate = `${beginDateParts[2]} de ${beginMonth} del ${beginDateParts[0]}`;
  endTextDate = `${endDateParts[2]} de ${endMonth} del ${endDateParts[0]}`;

  return `del ${beginTextDate} Al ${endTextDate}`;
}
// TODO: mejorar validación incluyendo regex y que beginDate si sea menor que endDate
/**
 * Valida si las fechas no está vacías.
 * @param {string} beginDate Fecha de inicio del rango
 * @param {string} endDate Fecha de fin del rango
 * @returns {boolean}
 */
export const validateInputDateRange = (beginDate, endDate) => (beginDate?.length === 10 && endDate?.length === 10);

/**
 * Obtiene el valor de la tienda que estará por defecto.
 * @returns {number} El identificador de la tienda
 */
export const getInitialTienda = () => tiendas.find((tienda => tienda.text === "M1")).value
/**
 * Obtiene el valor de la plaza que estará por defecto.
 * @returns {number} El identificador de la plaza
 */
export const getInitialPlaza = () => plazas.find((plaza => plaza.text === "MAZATLAN")).value;
/**
 * Crea los array de etiquetas y de dato para la gráfica de barras.
 * El objeto debe poseer las siguiete estructura:
 * 
 * DescGraf
 * 
 * Venta2022
 * 
 * Venta2021
 * 
 * Venta2020
 * 
 * El nombre los campos de ventas son dinámicos, por ello se utilizan
 * el año de inicio y de fin para obtener los datos.
 * 
 * 
 * @param {object[]} data Los datos para crear el dataset
 * @param {numbe} fromYear El año de inicio del intervalo
 * @param {number} toYear El año de fin del intervalo
 * @param {Dispatch<SetStateAction<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetStateAction<any[]>>} updateDatasets setState para el dataset
 */
export const createDatasets = (data, fromYear, toYear, updateLabels, updateDatasets) => {
  const colors = ['#991b1b', '#9a3412', '#3f6212', '#065f46', '#155e75'];

  if (data?.length !== 0) {
    let labels = [];
    labels = data.map(item => item.DescGraf);
    updateLabels(labels);

    let datasets = [];
    let colorIndex = 0;
    let dataSetIndex = 1;
    for (let i = toYear; i >= fromYear; i--) {

      datasets.push({
        id: dataSetIndex,
        label: `${i}`,
        data: data.map(item => item[`Venta${i}`]),
        backgroundColor: colors[colorIndex]
      });

      colorIndex++;
      dataSetIndex++;

      if (colorIndex === colors.length) {
        colorIndex = 0;
      }
    }

    updateDatasets(datasets);
  } else {
    updateLabels([]);
    updateDatasets([]);
  }
}

/**
 * Crea los array de etiquetas y de dato para la gráfica de barras.
 * El objeto debe poseer las siguiete estructura:
 * 
 * Descrip
 * 
 * Ventas
 * 
 * @param {object[]} data Los datos base para crear el dataset
 * @param {Dispatch<SetActionState<any[]>>} updateLabels setState para las etiquetas
 * @param {Dispatch<SetActionState<any[]>>} updateDataset setState para el dataset
 */
export const createSimpleDatasets = (data, updateLabels, updateDataset) => {
  if (data?.length !== 0) {
    let labels = data?.map(item => item.Descrip);
    let datasetItem = {};
    let datasets = [];

    datasetItem.id = 1;
    datasetItem.label = '';
    datasetItem.data = data?.map(item => item.Ventas);
    datasetItem.backgroundColor = '#155e75';

    datasets.push(datasetItem);

    updateLabels(labels);
    updateDataset(datasets);
  } else {
    updateLabels([]);
    updateDataset([]);
  }
}
