import ApiProvider from "./ApiProvider";

export async function getDiariasGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/diarias/grupo", body);
    return data.result;
  } catch (error) {
    console.log(error.message);
  }
}
