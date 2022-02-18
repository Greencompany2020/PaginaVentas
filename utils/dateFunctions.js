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
