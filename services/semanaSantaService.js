import ApiProvider from "./ApiProvider";

export async function getSemanaSantaGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/semanasanta/grupo", body)
    return data.result
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function getSemanaSantaGrupoConcentrado(body) {
  try {
    const { data } = await ApiProvider.post("/semanasanta/grupo/concentrado", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function getSemanaSantaPeriodos() {
  try {
    const { data } = await ApiProvider.get("/semanasanta/periodos");
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
