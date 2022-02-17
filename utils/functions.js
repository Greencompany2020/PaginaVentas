import { meses, tiendas } from "./data";

export const getTiendaName = (tiendaId) => {
  const tienda = tiendas.find((tienda) => tienda.value === tiendaId);
  return tienda?.text;
}

export const getMonth = (monthNumber) => {
  const monthObj = meses.find((mes) => mes.value === monthNumber);
  return monthObj?.text;
}

export const getLastTwoNumbers = (date) => {
  return date?.toString().slice(2);
}
