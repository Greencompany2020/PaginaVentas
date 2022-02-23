import ApiProvider from "./ApiProvider.js"

export async function getComparativoGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/comparativo/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data)
  }
}
