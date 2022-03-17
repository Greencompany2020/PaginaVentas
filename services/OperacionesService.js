import ApiProvider from "./ApiProvider";

export async function getOperacionesGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/operaciones/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
