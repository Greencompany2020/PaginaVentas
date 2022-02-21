import { format, nextSunday, previousMonday } from "date-fns";
import { meses } from "./data";

/**
 * Obtiene el nombre a partir del número del mes.
 * 
 * @param {number} monthNumber El número del mes
 * @returns {string}
 */
export const getMonthByNumber = (monthNumber) => {
  const monthObj = meses.find((mes) => mes.value === Number(monthNumber));
  return monthObj?.text;
}

/**
 * Obtiene las primeras tres letras del nombre del mes.
 * @param {string} month El nombre del mes
 * @returns {string}
 */
export const getMonthChars = (month) => month?.slice(0, 3);

/**
 * Obtiene el año del string de fecha.
 * @param {string} date fecha en formato YYYY-MM-DD
 * @returns {string}
 */
export const getYearFromDate = (date) => {
  let year = date?.split("-")[0];
  return year
};
/**
 * Obtiene el rango de fechas de la semana actual, es decir,
 * la fecha de inicio de las semana (lunes) y la fecha de fin de la semana (domingo)
 * @returns {string[]} Un array con el rango de fechas. El primer valor es la fecha de inicio y el segundo la de fin.
 */
export const getCurrentWeekDateRange = () => {
  const beginDate = format(previousMonday(new Date(Date.now())), "yyyy-MM-dd", { weekStartsOn: 1 });
  const endDate = format(nextSunday(new Date(Date.now())), "yyyy-MM-dd", { weekStartsOn: 1 });
  return [beginDate, endDate];
}
/**
 * Obtiene el número del mes actual.
 * @returns {number}
 */
export const getCurrentMonth = () => new Date(Date.now()).getMonth() + 1;
/**
 * Obtiene el año actual.
 * @returns {number}
 */
export const getCurrentYear = () => new Date(Date.now()).getFullYear();

/**
 * Recive la fecha en formato yyyy-MM-dd y 
 * la retorna con el nombre del mes. Ej.
 * 
 * 2022-01-26 -> 26-Ene-2022
 * 
 * @param {string} date Fecha a formatear
 * @returns {string}
 */
export const formatLastDate = (date) => {
  let formatedDate = "";
  let dateParts = date.split("-");
  let month = meses.find((mes) => mes.value === Number(dateParts[1]))
  month = month.text.slice(0, 3);
  formatedDate = `${dateParts[2]}-${month}-${dateParts[0]}`;
  return formatedDate;
}

/**
 * Crea la fecha y la regresa en formato yyyy-MM-dd.
 * 
 * Si no se especifica el año o mes, la utiliza la fecha actual
 * como base.
 * 
 * @param {number} year El Año
 * @param {number} month El Mes
 * @returns 
 */
export const formatedDate = (year = 0, month = 0) => {
  let currentDateInstance = new Date(Date.now());

  if (year !== 0 && month !== 0) {
    return format(
      new Date(year, month - 1, currentDateInstance.getDate()),
      "yyyy-MM-dd",
      { weekStartsOn: 1 }
    )
  }

  if (year !== 0) {
    return format(
      new Date(year, currentDateInstance.getMonth(), currentDateInstance.getDate()),
      "yyyy-MM-dd",
      { weekStartsOn: 1 }
    )
  }

  if (month !== 0) {
    return format(
      new Date(currentDateInstance.getFullYear(), month - 1, currentDateInstance.getDate()),
      "yyyy-MM-dd",
      { weekStartsOn: 1 }
    )
  }

  return format(
    new Date(currentDateInstance.getFullYear(), currentDateInstance.getMonth(), currentDateInstance.getDate()),
    "yyyy-MM-dd",
    { weekStartsOn: 1 }
  )
}
