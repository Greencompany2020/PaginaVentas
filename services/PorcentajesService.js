import ApiProvider from "./ApiProvider";

export async function getPorcenatajesParticipacion(body) {
  try {
    const { data } = await ApiProvider.post("/porcentajes/participacion", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
