import configuradorProvider from "./providers/configuradorProvider";

export default function configuratorService() {
  const getUsers = async () => {
    try {
      const { data } = await configuradorProvider.get("/usuarios?page=1&size=300");
      return data;
    } catch (error) {
      throw error;
    }
  }

  const getGroups = async () => {
    try {
      const { data } = await configuradorProvider.get("/grupos");
      return data;
    } catch (error) {
      throw error;
    }
  }

  const getAccess = async () => {
    try {
      const { data } = await configuradorProvider.get("/accesos");
      return data;
    } catch (error) {
      throw error;
    }
  }

  const getUserDetail = async (userId) => {
    try {
      const { data } = await configuradorProvider.get(`/accesos/perfil/${userId}`);
      const response = await getAccess();
      const { Accesos, ...usuario } = data;
      const formatedData = replaceAccess(response, Accesos);
      const newData = {
        usuario,
        accesos: formatedData
      }
      return newData;
    } catch (error) {
      throw error;
    }
  }

  const assignAccess = async (body) => {
    try {
      const response = await configuradorProvider.post(
        "/accesos/assign",
        body
      );
      return response;
    } catch (error) {
      throw error;
    }
  }

  const createUser = async (body) => {
    try {
      const { data } = await configuradorProvider.post(
        "/usuarios/create",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (id, body) => {
    try {
      const { data } = await configuradorProvider.put(
        `/usuarios/update/${id}`,
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      const { data } = await configuradorProvider.delete(
        `/usuarios/delete/${id}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  };

  const createGroup = async (body) => {
    try {
      const { data } = await configuradorProvider.post("/grupos/create", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  const updateGroup = async (id, body) => {
    try {
      const params = { Nombre: body.Nombre };
      const { data } = await configuradorProvider.put(
        `/grupos/update/${id}`,
        params
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  const deleteGroup = async (id) => {
    try {
      const { data } = await configuradorProvider.delete(
        `/grupos/delete/${id}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  const createAccess = async (body) => {
    try {
      const { data } = await configuradorProvider.post(
        "/accesos/create",
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  const updateAccess = async (id, body) => {
    try {
      const { data } = await configuradorProvider.put(
        `/accesos/update/${id}`,
        body
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  const deleteAccess = async (id) => {
    try {
      const { data } = await configuradorProvider.delete(
        `/accesos/delete/${id}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  const configureParameters = async (idDashboard, body) => {
    try {
      const response = await configuradorProvider.post(`/dashboards/parameters/${idDashboard}`, body);
      return response;
    } catch (error) {
      throw error
    }
  }

  const getParameters = async (idDashboard) => {
    try {
      const { data } = await configuradorProvider.get(`/dashboards/parameters/${idDashboard}`);
      return data;
    } catch (error) {
      throw error;
    }
  }

  const replaceAccess = (current, next) => {
    const modified = current.map((item) => {
      let modify = {};
      next.forEach((userAccess) => {
        if (item.idDashboard == userAccess.idDashboard) {
          modify = { ...item, acceso: userAccess.acceso };
        }
      });
      if (Object.keys(modify).length > 0) return modify;
      return { ...item, acceso: false };
    });
    return modified;
  };

  const getGruposDigitalizacion = async () => {
    try {
      const { data } = await configuradorProvider.get('/grupos-digitalizacion');
      return data;
    } catch (error) {
      throw error;
    }
  }

  const setUserToGrupoDigitalizacion = async body => {
    try {
      const response = await configuradorProvider.post('/grupos-digitalizacion/usuario', body);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const createDigitalizacionGrupo = async body => {
    try {
      const response = await configuradorProvider.post('/grupos-digitalizacion', body);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const updateDigitalizacionGrupo = async (id, body) => {
    try {
      const response = await configuradorProvider.put(`/grupos-digitalizacion/${id}`, body);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const deleteDigitalizacionGrupo = async id => {
    try {
      const response = await configuradorProvider.delete(`/grupos-digitalizacion/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  const getLocalities = async () => {
    try {
      const { data } = await configuradorProvider.get('/localidades');
      return data;
    } catch (error) {
      throw error;
    }
  }

  const getSAPUsers = async () => {
    try {
      const { data } = await configuradorProvider.get('/usuarios/sap');
      return data;
    } catch (error) {
      throw error;
    }
  }

  const getProyects = async () => {
    try {
      const { data } = await configuradorProvider.get('/proyectos');
      return data;
    } catch (error) {
      throw error;
    }
  }

  const createProyect = async (body) => {
    try {
      const data = await configuradorProvider.post('/proyectos', body);
    } catch (error) {
      throw error;
    }
  }

  const updateProyect = async(id, body) => {
    try {
      const data = await configuradorProvider.put(`/proyectos/${id}`, body);
    } catch (error) {
      throw error;
    }
  }

  return {
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
    configureParameters,
    getParameters,
    replaceAccess,
    getGruposDigitalizacion,
    setUserToGrupoDigitalizacion,
    createDigitalizacionGrupo,
    updateDigitalizacionGrupo,
    deleteDigitalizacionGrupo,
    getLocalities,
    getSAPUsers,
    getProyects,
    createProyect,
    updateProyect
  };
}

