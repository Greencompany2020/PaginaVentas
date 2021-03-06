import ApiProvider from "./ApiProvider";

export async function getMesesAgnosGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/mesesvsanios/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getMesesAgnosPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/mesesvsanios/plazas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getMesesAgnosTiendas(body) {
  try {
    const { data } = await ApiProvider.post("/mesesvsanios/tiendas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getMesesAgnosTodasTiendas(body) {
  try {
    const { data } = await ApiProvider.post("/mesesvsanios/todastiendas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}
