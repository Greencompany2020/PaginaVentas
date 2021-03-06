import ApiProvider from "./ApiProvider";

export async function getSemanaSantaGrupo(body) {
  try {
    const { data } = await ApiProvider.post("/semanasanta/grupo", body)
    return data.result
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getSemanaSantaGrupoConcentrado(body) {
  try {
    const { data } = await ApiProvider.post("/semanasanta/grupo/concentrado", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getSemanaSantaPeriodos() {
  try {
    const { data } = await ApiProvider.get("/semanasanta/periodos");
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getSemanaSantaPlazas(body) {
  try {
    const { data } = await ApiProvider.post("/semanasanta/plazas", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}

export async function getSemanaSantaAcumulado(body) {
  try {
    const { data } = await ApiProvider.post("/semanasanta/acumulado", body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
    return error;
  }
}
