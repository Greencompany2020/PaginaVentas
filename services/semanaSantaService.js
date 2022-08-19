import { reporteProvider } from './apiProvider';

export async function getSemanaSantaGrupo(body) {
  try {
    const { data } = await reporteProvider.post("/semanasanta/grupo", body)
    return data.result
  } catch (error) {
    return error;
  }
}

export async function getSemanaSantaGrupoConcentrado(body) {
  try {
    const { data } = await reporteProvider.post("/semanasanta/grupo/concentrado", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getSemanaSantaPeriodos() {
  try {
    const { data } = await reporteProvider.get("/semanasanta/periodos");
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getSemanaSantaPlazas(body) {
  try {
    const { data } = await reporteProvider.post("/semanasanta/plazas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getSemanaSantaAcumulado(body) {
  try {
    const { data } = await reporteProvider.post("/semanasanta/acumulado", body);
    return data.result;
  } catch (error) {
    return error;
  }
}
