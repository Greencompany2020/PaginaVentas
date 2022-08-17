import reportProvider from './providers/reportProvider';

export async function getMensualesConcentrado(body) {
  try {
    const { data } = await reportProvider.post("/mensuales/concentrado", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getMensualesPlazasAgnos(body) {
  try {
    const { data } = await reportProvider.post("/mensuales/plazasagnos", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getMensualesTiendas(body) {
  try {
    const { data } = await reportProvider.post("/mensuales/tiendas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}
