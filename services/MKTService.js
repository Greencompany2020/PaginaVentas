import { reporteProvider } from './apiProvider';

export async function getPromotores(body) {
  try {
    const { data } = await reporteProvider.post("/mkt/promotores", body);
    return data.result;
  } catch (error) {
    return error;
  }
}
