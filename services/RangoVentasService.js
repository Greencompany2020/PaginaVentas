import ApiProvider from "./ApiProvider";

export async function getRangoVentasPlaza(body) {
  try {
    const { data } = await ApiProvider.post("/rangoventas/plaza", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function getRangoVentasTienda(body) {
  try {
    const { data } = await ApiProvider.post("/rangoventas/tienda", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
