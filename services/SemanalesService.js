import reporteProvider from "./providers/reporteProvider";

export async function getSemanalesCompromisos(body) {
  try {
    const { data } = await reporteProvider.post("/semanales/compromisos", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getSemanalesPlazas(body) {
  try {
    const { data } = await reporteProvider.post("/semanales/plazas", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getSemanalesTiendas(body) {
  try {
    const { data } = await reporteProvider.post("/semanales/tiendas", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function updateSemalesCompromisos(body) {
  try {
    const { data } = await reporteProvider.put("/semanales/compromisos/update", body);
    return data;
  } catch (error) {
    throw error;
  }
}
