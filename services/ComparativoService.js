import reporteProvider from "./providers/reporteProvider";

export async function getComparativoGrupo(body) {
  try {
    const { data } = await reporteProvider.post("/comparativo/grupo", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getComparativoPlazas(body) {
  try {
    const { data } = await reporteProvider.post("/comparativo/plazas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}
