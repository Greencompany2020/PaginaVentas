import reporteProvider from "./providers/reporteProvider";

export async function getTiendas(userLevel) {
  try {
    const { data } = await reporteProvider.post("/tiendasplazas/tiendas", {
      userLevel
    });
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getPlazas(userLevel) {
  try {
    const { data } = await reporteProvider.post("/tiendasplazas/plazas", {
      userLevel
    });
    return data.result;
  } catch (error) {
    throw error;
  }
}
