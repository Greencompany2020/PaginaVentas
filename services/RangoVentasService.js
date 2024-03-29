import reporteProvider from "./providers/reporteProvider";

export async function getRangoVentasPlaza(body) {
  try {
    const { data } = await reporteProvider.post("/rangoventas/plaza", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getRangoVentasTienda(body) {
  try {
    const { data } = await reporteProvider.post("/rangoventas/tienda", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}
