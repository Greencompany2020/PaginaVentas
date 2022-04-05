import ApiProvider from "./ApiProvider.js"

export async function getComparativoGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/comparativo/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data)
    return error;
  }
}

export async function getComparativoPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/comparativo/plazas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
