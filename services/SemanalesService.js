import ApiProvider from "./ApiProvider";

export async function getSemanalesCompromisos(body) {
  try {
    const { data } = await ApiProvider.post("/semanales/compromisos", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getSemanalesPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/semanales/plazas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getSemanalesTiendas(body) {
  try {
    const { data } = await ApiProvider.post("/semanales/tiendas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function updateSemalesCompromisos(body) {
  try {
    const { data } = await ApiProvider.put("/semanales/compromisos/update", body);
    return data;
  } catch (error) {
    return error;
  }
}
