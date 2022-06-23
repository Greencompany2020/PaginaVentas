import ApiProvider from "./ApiProvider";

export async function getPorcenatajesParticipacion(body) {
  try {
    const { data } = await ApiProvider.post("/porcentajes/participacion", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPorcentajeCrecimiento(body) {
  try {
    const { data } = await ApiProvider.post("/porcentajes/crecimiento", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPorcentajesMensuales(body) {
  try {
    const { data } = await ApiProvider.post("/porcentajes/mensuales", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}
