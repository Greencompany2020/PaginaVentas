import reporteProvider from "./providers/reporteProvider";

export async function getOperacionesGrupo(body) {
  try {
    const { data } = await reporteProvider.post("/operaciones/grupo", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getOperacionesPlaza(body) {
  try {
    const { data } = await reporteProvider.post("/operaciones/plaza", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getOperacionesTienda(body) {
  try {
    const { data } = await reporteProvider.post("/operaciones/tienda", body);
    return data.result;
  } catch (error) {
    return error;
  }
}
