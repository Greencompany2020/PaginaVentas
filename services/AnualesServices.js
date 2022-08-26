import reporteProvider from "./providers/reporteProvider";

export async function getAnualesPlazas(body) {
  try {
    const { data } = await reporteProvider.post("/anuales/plazas", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getAnualesTiendas(body) {
  try {
    const { data } = await reporteProvider.post("/anuales/tiendas", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}
