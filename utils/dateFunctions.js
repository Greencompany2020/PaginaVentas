import { format, getDay, nextSunday, previousMonday, sub } from "date-fns";
import { meses } from "./data";
import { getDayWeekName } from "./functions";

/**
 * Obtiene el nombre a partir del número del mes.
 * 
 * @param {number} monthNumber El número del mes
 * @returns {string} El nombre del mes.
 */
export const getMonthByNumber = (monthNumber) => {
  const monthObj = meses.find((mes) => mes.value === Number(monthNumber));
  return monthObj?.text;
}

/**
 * Obtiene las primeras tres letras del nombre del mes.
 * @param {string} month El nombre del mes
 * @returns {string} Las iniciales del nombre del mes.
 */
export const getMonthChars = (month) => month?.slice(0, 3);

/**
 * Obtiene el año del string de fecha.
 * @param {string} date fecha en formato YYYY-MM-DD
 * @returns {string} El texto del año.
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
 * Obtiene el rango de fechas de la semana actual, desde el lunes hasta un dia anterior 
 * la fecha actual.
 * @param {string} date fecha en formate yyyy-MM-dd
 * @returns {object} Un objeto con la fechas de inicio y fin del rango, además del texto con el día de la semana y el nombre del mes.
 * 
 *  - beginDate
 *  - endDate
 *  - dateRangeText
 */
export const getBeginCurrentWeekDateRange = (date) => {
  const dateParts = date?.split("-");
  const currentDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  const beginDate = format(previousMonday(currentDate), "yyyy-MM-dd", { weekStartsOn: 1 });
  const endDate = format(currentDate, "yyyy-MM-dd", { weekStartsOn: 1 });
  const dateRangeText = `${getDayWeekName(beginDate)} Al ${getDayWeekName(endDate)}`
  return { beginDate, endDate, dateRangeText };
}

/**
 * Obtiene el número del mes actual.
 * @returns {number} Mes actual
 */
export const getCurrentMonth = () => new Date(Date.now()).getMonth() + 1;
/**
 * Obtiene el año actual.
 * @returns {number} Año actual.
 */
export const getCurrentYear = () => new Date(Date.now()).getFullYear();

/**
 * Recive la fecha en formato yyyy-MM-dd y 
 * la retorna con el nombre del mes. Ej.
 * 
 * 2022-01-26 -> 26-Ene-2022
 * 
 * @param {string} date Fecha a formatear
 * @returns {string} fecha en formato dia-inicialesMes-año
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
 * @returns {string} fecha en formato yyyy-MM-dd
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
/**
 * Obtiene el nombre del día de la semana a partir de la fecha ingresada.
 * @param {string} date fecha en formato yyyy-MM-dd
 * @returns {string} Nombre del dia de la semana
 */
export const getNameDay = (date) => {
  const dateParts = date?.split("-");
  const weekDays = [
    {
      name: "Lunes",
      value: 1
    },
    {
      name: "Martes",
      value: 2
    },
    {
      name: "Miercoles",
      value: 3
    },
    {
      name: "Jueves",
      value: 4
    },
    {
      name: "Viernes",
      value: 5
    },
    {
      name: "Sabado",
      value: 6
    },
    {
      name: "Lunes",
      value: 0
    },
  ]
  const currentDate = new Date(dateParts[0], dateParts[1], dateParts[2]);
  const dayName = weekDays.find(day => day.value === getDay(currentDate))
  return dayName.name;
}
/**
 * Resta los días indicados a partir de la fecha actual.
 * @param {number} days El número de dias a restar a la fecha
 * @returns {string} fecha en formato yyyy-MM-dd
 */
export const getPrevDate = (days) => {
  const currentDate = new Date(Date.now());
  const prevDate = sub(currentDate, { days });
  return format(prevDate, "yyy-MM-dd", { weekStartsOn: 1 });
}
