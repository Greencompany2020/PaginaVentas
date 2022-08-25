import reporteProvider from "./providers/reporteProvider";

export async function getMesesAgnosGrupo(body) {
  try {
    const { data } = await reporteProvider.post("/mesesvsanios/grupo", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getMesesAgnosPlazas(body) {
  try {
    const { data } = await reporteProvider.post("/mesesvsanios/plazas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getMesesAgnosTiendas(body) {
  try {
    const { data } = await reporteProvider.post("/mesesvsanios/tiendas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getMesesAgnosTodasTiendas(body) {
  try {
    const { data } = await reporteProvider.post("/mesesvsanios/todastiendas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}
