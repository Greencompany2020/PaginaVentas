import { 
  format,
  getDay,
  nextSunday,
  previousMonday,
  sub,
  add,
  endOfMonth,
  startOfMonth,
  subMonths,
  subYears
} from "date-fns";
import { meses } from "./data";
import { getDayWeekName, validateDate } from "./functions";

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
 * @param {number} days El número de dias a restar a la fecha.
 * @param {number} year El año a crear la fecha. Si se asigna este valor obtiene por defecto la fecha del dia anterior, por ello se deja 
 * en 0 el valor de days.
 * @returns {string} fecha en formato yyyy-MM-dd
 */
export const getPrevDate = (days, year = 0) => {
  let currentDate = new Date(Date.now());
  if (year > 0) {
    const dateParts = format(currentDate, "yyyy-MM-dd", { weekStartsOn: 1 }).split("-");
    currentDate = Date.parse(`${year}-${dateParts[1]}-${dateParts[2]}`);
  }
  const prevDate = sub(currentDate, { days });
  return format(prevDate, "yyyy-MM-dd", { weekStartsOn: 1 });
}
/**
 * Calcula la fechas de inicio y de fin de la semana santa del año ingresado.
 * La lógica de la función es obtenida de la original en PHP.
 * @param {number} year El año a obtener la semana santa
 * @returns {string[]} Un array con la fechas de inicio y de fin.
 */
export const semanaSanta = (year, timestamp = false, finSemanaAnterior = false) => {
  const pDig = parseInt(year / 100, 10);
  const pDec = year % 19;

  let result = parseInt((pDig - 15) / 2, 10) + 202 - 11 * pDec;

  if (pDig > 26) result = result - 1;
  if (pDig > 36) result = result - 1;

  if (
    pDig === 21 ||
    pDig === 24 ||
    pDig === 25 ||
    pDig === 33 ||
    pDig === 33 ||
    pDig === 37
  ) {
    result = result - 1;
  }

  result = result % 30;
  let resultA = result + 21;

  if (result === 29) resultA = resultA - 1;
  if (result === 28 && pDec > 10) resultA = resultA - 1;
  // Obtiene el último domingo
  let resultB = (resultA - 19) % 7;
  let resultC = (40 - pDig) % 4;

  if (resultC === 3) resultC = resultC + 1;
  if (resultC > 1) resultC = resultC + 1;

  result = year % 100;
  let resultD = (result + parseInt(result / 4, 10)) % 7;

  let resultE = ((20 - resultB - resultC - resultD) % 7) + 1;
  let dia = resultA + resultE;
  let mes = 0;

  if (dia > 31) {
    dia = dia - 31;
    mes = 4;
  } else {
    mes = 3;
  }

  // teniendo el domingo de semana santa debemos sumarle 6 dias atras
  // y 7 delante para obtener los 14 dias a evaluar (Sem.Sta y Pascua)
  const domingo = new Date(year, mes - 1, dia);

  let fechaInicio = null;

  if (finSemanaAnterior) {
    fechaInicio = sub(domingo, { days: 9 }); // Sumamos 9 por el fin de semana a incluir
  } else {
    fechaInicio = sub(domingo, { days: 6 });
  }

  if (timestamp) fechaInicio = fechaInicio.getTime();
  else fechaInicio = format(fechaInicio, "yyyy-MM-dd", { weekStartsOn: 1 });

  let fechaFin = add(domingo, { days: 7 });

  if (timestamp) fechaFin = fechaFin.getTime();
  else fechaFin = format(fechaFin, "yyyy-MM-dd", { weekStartsOn: 1 });

  return [fechaInicio, fechaFin];
}
/**
 * Obtiene la fecha actual. Si se especifica semanaSta obtiene
 * la fecha de inicio o de fin de la misma en base a la fecha actual.
 * @param {boolean} semanaSta Si se va a considerar Semana Santa.
 * @returns {string} La fecha en formato yyyy-MM-dd
 */
export const getCurrentDate = (semanaSta = false) => {
  if (semanaSta) {
    const date = new Date(Date.now()); 
    const [fechaInicioTime, fechaFinTime] = semanaSanta(date.getFullYear(), true);
    const [fechaInicio, fechaFin] = semanaSanta(date.getFullYear());

    if (date.getTime() < fechaInicioTime) return fechaInicio;
    else if (date.getTime() > fechaFinTime) return fechaFin;
  }
  return format(Date.now(), "yyyy-MM-dd", { weekStartsOn: 1 });
}

export const getBeginEndMonth = (prevMonth = false, prevYear = false) => {
  let today = null;
  
  today = new Date(Date.now());

  if (prevMonth) {
    today = subMonths(today, 1);
  }

  if (prevYear) {
    today = subYears(today, 1);
  }
    
  const beginMonth = format(startOfMonth(today), "yyyy-MM-dd")
  const endMonth = format(endOfMonth(today), "yyyy-MM-dd");
  return [beginMonth, endMonth];
}

export const currentDate = () => {
  const date = format(new Date(Date.now()), 'yyyy-MM-dd');
  const year = parseInt(date.split('-')[0], 10);
  const month = parseInt(date.split('-')[1], 10);
  const day = parseInt(date.split('')[2], 10);
  return{
    year,
    month,
    day
  }
}
