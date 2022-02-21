import ApiProvider from "./ApiProvider";

export async function getAnualesPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/anuales/plazas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
