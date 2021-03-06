import ApiProvider from "./ApiProvider";

export async function getAnualesPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/anuales/plazas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getAnualesTiendas(body) {
  try {
    const { data } = await ApiProvider.post("/anuales/tiendas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}
