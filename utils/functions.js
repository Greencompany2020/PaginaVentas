import { tiendas } from "./data";
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
/**
 * Valida si las fechas no está vacías.
 * @param {string} beginDate Fecha de inicio del rango
 * @param {string} endDate Fecha de fin del rango
 * @returns {boolean}
 */
export const validateInputDateRange = (beginDate, endDate) => (beginDate?.length === 10 && endDate?.length === 10);
