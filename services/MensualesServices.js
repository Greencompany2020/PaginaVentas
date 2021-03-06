import ApiProvider from "./ApiProvider";

export async function getMensualesConcentrado(body) {
  try {
    const { data } = await ApiProvider.post("/mensuales/concentrado", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getMensualesPlazasAgnos(body) {
  try {
    const { data } = await ApiProvider.post("/mensuales/plazasagnos", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getMensualesTiendas(body) {
  try {
    const { data } = await ApiProvider.post("/mensuales/tiendas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}
