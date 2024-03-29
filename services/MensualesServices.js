import reporteProvider from "./providers/reporteProvider";

export async function getMensualesConcentrado(body) {
  try {
    const { data } = await reporteProvider.post("/mensuales/concentrado", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getMensualesPlazasAgnos(body) {
  try {
    const { data } = await reporteProvider.post("/mensuales/plazasagnos", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getMensualesTiendas(body) {
  try {
    const { data } = await reporteProvider.post("/mensuales/tiendas", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}
