import ApiProvider from './ApiProvider';

export async function getPresupuestoGrupo(body) {
  try {
    const { data } = await ApiProvider.post('/presupuesto/grupo', body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPresupuestoFechas(body) {
  try {
    const { data } = await ApiProvider.post('/presupuesto/fechas', body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPresupuestoPlazas(body) {
  try {
    const { data } = await ApiProvider.post('/presupuesto/plazas', body);
    return data.result;
  } catch (error) {
    return error;
  }
}

export async function getPresupuestoTienda(body) {
  try {
    const { data } = await ApiProvider.post('/presupuesto/tienda', body);
    return data.result;
  } catch (error) {
    return error;
  }
}
