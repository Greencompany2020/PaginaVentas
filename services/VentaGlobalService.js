import reporteProvider from "./providers/reporteProvider";

export async function getVentaGlobalSegmento(body) {
  try {
    const { data } = await reporteProvider.post("/ventaglobal/segmento", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}

export async function getVentaGlobalMarca(body) {
  try {
    const { data } = await reporteProvider.post("/ventaglobal/marca", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}
