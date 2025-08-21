import reporteProvider from "./providers/reporteProvider";

export async function getVentaDetNivelTienda(body) {
  try {
    const { data } = await reporteProvider.post("/ventadetniveltienda", body);
    return data.result;
  } catch (error) {
    throw error;
  }
}