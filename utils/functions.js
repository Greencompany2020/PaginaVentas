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
