import { meses, tiendas } from "./data";

export const getTiendaName = (tiendaId) => {
  const tienda = tiendas.find((tienda) => tienda.value === tiendaId);
  return tienda?.text;
}

export const getMonth = (monthNumber) => {
  const monthObj = meses.find((mes) => mes.value === Number(monthNumber));
  return monthObj?.text;
}

export const getLastTwoNumbers = (date) => {
  return date?.toString().slice(2);
}

export const formatDateInput = (date) => {
  let formatedDate = "";
  let dateParts = date.split("/");
  formatedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  return formatedDate;
}

const getMonthChars = (month) => month?.slice(0, 3);

export const dateRangeTitle = (beginDate, endDate) => {
  let beginTextDate = "";
  let endTextDate = "";

  let beginDateParts = beginDate.split("-");
  let endDateParts = endDate.split("-");

  let beginMonth = getMonth(beginDateParts[1]);
  beginMonth = getMonthChars(beginMonth);

  let endMonth = getMonth(endDateParts[1]);
  endMonth = getMonthChars(endMonth);

  beginTextDate = `${beginDateParts[2]} de ${beginMonth} del ${beginDateParts[0]}`;
  endTextDate = `${endDateParts[2]} de ${endMonth} del ${endDateParts[0]}`;

  return `del ${beginTextDate} Al ${endTextDate}`;
}

export const validateInputDateRange = (beginDate, endDate) => (beginDate?.length === 10 && endDate?.length === 10)

export const getYearFromDate = (date) => {
  let year = date?.split("-")[0];
  return year
};
