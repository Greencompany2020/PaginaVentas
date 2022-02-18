import ApiProvider from "./ApiProvider";

export async function getSemanalesCompromisos(body) {
  try {
    const { data } = await ApiProvider.post("/semanales/compromisos", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
