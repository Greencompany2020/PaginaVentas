import ApiProvider from "./ApiProvider";

export async function getPromotores(body) {
  try {
    const { data } = await ApiProvider.post("/mkt/promotores", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}
