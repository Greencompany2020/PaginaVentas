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
 * Obtiene la fecha actual en formato yyyy-MM-dd. Se puede
 * especificar los años a restar a partir de la fecha actual.
 * 
 * También se puede ingresar un año para obtener la fecha y 
 * a partir de ese restarle los años.
 * 
 * @param {number} year Un año cualquiera
 * @param {number} minus Los años a restar
 * @returns 
 */
export const getCurrentOrPrevDate = (year = 0, minus = 0) => {
  let currentDate = null;
  let month = 0;
  let day = 0;

  if (year > 0) {
    currentDate = new Date(Date.now());
    month = currentDate.getMonth();
    day = currentDate.getDate();
    return format(new Date(year, month, day), "yyyy-MM-dd", { weekStartsOn: 1 });
  }
  if (minus > 0) {
    currentDate = new Date(Date.now());
    if (year === 0) {
      year = currentDate.getFullYear() - minus;
    } else {
      year = currentDate.getFullYear();
    }
    month = currentDate.getMonth();
    day = currentDate.getDate();
    return format(new Date(year, month, day), "yyyy-MM-dd", { weekStartsOn: 1 });
  }
  return format(new Date(Date.now()), "yyyy-MM-dd", { weekStartsOn: 1 });
}

export const formatLastDate = (date) => {
  let formatedDate = "";
  let dateParts = date.split("-");
  let month = meses.find((mes) => mes.value === Number(dateParts[1]))
  month = month.text.slice(0, 3);
  formatedDate = `${dateParts[2]}-${month}-${dateParts[0]}`;
  return formatedDate;
}
