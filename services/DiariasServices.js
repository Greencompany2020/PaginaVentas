import { reporteProvider } from './apiProvider';

export async function getDiariasGrupo(body) {
  try {
    const { data } = await  reporteProvider.post("/diarias/grupo", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getDiariasPlazas(body) {
  try {
    const { data } = await  reporteProvider.post("/diarias/plazas", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getDiariasTienda(body) {
  try {
    const { data } = await  reporteProvider.post("/diarias/tienda", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getDiariasTiendaSimple(body) {
  try {
    const { data } = await  reporteProvider.post("/diarias/tiendasimple", body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getDiariasFechas() {
  try {
    const { data } = await  reporteProvider.get("/diarias/fechas");
    return data.result;
  } catch (error) {
    return error;
  }
}
