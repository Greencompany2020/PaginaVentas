import reporteProvider from "./providers/reporteProvider";

export async function getPorcenatajesParticipacion(body) {
  try {
    const { data } = await reporteProvider.post("/porcentajes/participacion", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getPorcentajeCrecimiento(body) {
  try {
    const { data } = await reporteProvider.post("/porcentajes/crecimiento", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getPorcentajesMensuales(body) {
  try {
    const { data } = await reporteProvider.post("/porcentajes/mensuales", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}
