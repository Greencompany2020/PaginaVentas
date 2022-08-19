import { reporteProvider } from './apiProvider';

export async function getPresupuestoGrupo(body) {
  try {
    const { data } = await reporteProvider.post('/presupuesto/grupo', body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPresupuestoFechas(body) {
  try {
    const { data } = await reporteProvider.post('/presupuesto/fechas', body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPresupuestoPlazas(body) {
  try {
    const { data } = await reporteProvider.post('/presupuesto/plazas', body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPresupuestoTienda(body) {
  try {
    const { data } = await reporteProvider.post('/presupuesto/tienda', body);
    return data.result;
  } catch (error) {
    return error;
  }
}
