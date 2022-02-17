import ApiProvider from "./ApiProvider";

export async function getDiariasGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/diarias/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function getDiariasPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/diarias/plazas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function getDiariasTienda(body) {
  try {
    const { data } = await ApiProvider.post("/diarias/tienda", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function getDiariasTiendaSimple(body) {
  try {
    const { data } = await ApiProvider.post("/diarias/tiendasimple", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
