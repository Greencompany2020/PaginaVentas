import ApiProvider from "./ApiProvider";

export async function getOperacionesGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/operaciones/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getOperacionesPlaza(body) {
  try {
    const { data } = await ApiProvider.post("/operaciones/plaza", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getOperacionesTienda(body) {
  try {
    const { data } = await ApiProvider.post("/operaciones/tienda", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}
