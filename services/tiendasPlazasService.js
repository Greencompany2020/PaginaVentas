import ApiProvider from "./ApiProvider";

export async function getTiendas(userLevel) {
  try {
    const { data } = await ApiProvider.post("/tiendasplazas/tiendas", {
      userLevel
    });
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPlazas(userLevel) {
  try {
    const { data } = await ApiProvider.post("/tiendasplazas/plazas", {
      userLevel
    });
    return data.result;
  } catch (error) {
    return error;
  }
}
