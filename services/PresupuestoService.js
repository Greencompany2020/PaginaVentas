import ApiProvider from './ApiProvider';

export async function getPresupuestoGrupo(body) {
  try {
    const { data } = await ApiProvider.post('/presupuesto/grupo', body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}

export async function getPresupuestoFechas(body) {
  try {
    const { data } = await ApiProvider.post('/presupuesto/fechas', body);
    return data.result;
  } catch (error) {
    console.log(error?.response?.data);
  }
}
