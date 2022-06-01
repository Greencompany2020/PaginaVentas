import ApiProvider from "./ApiProvider";

async function getUsers() {
  try {
    const { data } = await ApiProvider.get("/configurador/usuarios");
    return data;
  } catch (error) {
    throw error;
  }
}

async function getGroups() {
  try {
    const { data } = await ApiProvider.get("/configurador/grupos");
    return data;
  } catch (error) {
    throw error;
  }
}

async function getAccess() {
  try {
    const { data } = await ApiProvider.get("/configurador/accesos");
    return data;
  } catch (error) {
    throw error;
  }
}

async function getUserDetail(userId) {
  try {
    const { data, status } = await ApiProvider.get(
      `configurador/accesos/perfil/${userId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async function assignAccess(body) {
  try {
    const response = await ApiProvider.post(
      "configurador/accesos/assign",
      body
    );
    return response;
  } catch (error) {
    throw error;
  }
}

const createUser = async (body) => {
  try {
    const { data } = await ApiProvider.post(
      "configurador/usuarios/create",
      body
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, body) => {
  try {
    const { data } = await ApiProvider.put(
      `configurador/usuarios/update/${id}`,
      body
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const { data } = await ApiProvider.delete(
      `configurador/usuarios/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

async function createGroup(body) {
  try {
    const { data } = await ApiProvider.post("configurador/grupos/create", body);
    return data;
  } catch (error) {
    throw error;
  }
}

async function updateGroup(id, body) {
  try {
    const params = { Nombre: body.Nombre };
    const { data } = await ApiProvider.put(
      `configurador/grupos/update/${id}`,
      params
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async function deleteGroup(id) {
  try {
    const { data } = await ApiProvider.delete(
      `configurador/grupos/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async function createAccess(body) {
  try {
    const { data } = await ApiProvider.post(
      "configurador/accesos/create",
      body
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async function updateAccess(id, body) {
  try {
    const { data } = await ApiProvider.put(
      `configurador/accesos/update/${id}`,
      body
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async function deleteAccess(id) {
  try {
    const { data } = await ApiProvider.delete(
      `configurador/accesos/delete/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
}

export {
  getUsers,
  getGroups,
  getAccess,
  getUserDetail,
  createUser,
  updateUser,
  deleteUser,
  createGroup,
  updateGroup,
  deleteGroup,
  createAccess,
  updateAccess,
  deleteAccess,
  assignAccess,
};
