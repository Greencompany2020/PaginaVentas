import { reporteProvider } from './apiProvider';

export async function getTiendas(userLevel) {
  try {
    const { data } = await reporteProvider.post("/tiendasplazas/tiendas", {
      userLevel
    });
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPlazas(userLevel) {
  try {
    const { data } = await reporteProvider.post("/tiendasplazas/plazas", {
      userLevel
    });
    return data.result;
  } catch (error) {
    return error;
  }
}
