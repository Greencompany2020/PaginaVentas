import ApiProvider from "./ApiProvider";

export async function getMesesAgnosGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/mesesvsanios/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
