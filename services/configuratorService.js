import ApiProvider from "./ApiProvider";

export default function configuratorService(){
  const getUsers = async () => {
    try {
      const { data } = await ApiProvider.get("/configurador/usuarios");
      return data;
    } catch (error) {
      throw error;
    }
  }

  const getGroups = async () => {
    try {
      const { data } = await ApiProvider.get("/configurador/grupos");
      return data;
    } catch (error) {
      throw error;
    }
  }

  const getAccess = async () => {
    try {
      const { data } = await ApiProvider.get("/configurador/accesos");
      return data;
    } catch (error) {
      throw error;
    }
  }

  const  getUserDetail = async (userId) => {
    try {
      const { data } = await ApiProvider.get(`configurador/accesos/perfil/${userId}`);
      const response = await getAccess();
      const { Accesos, ...usuario} = data;
      const formatedData = replaceAccess(response,  Accesos);
      const newData = {
        usuario,
        accesos:formatedData
      }
      return newData;
    } catch (error) {
      throw error;
    }
  }

  const assignAccess = async (body) => {
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

  const createGroup = async (body) => {
    try {
      const { data } = await ApiProvider.post("configurador/grupos/create", body);
      return data;
    } catch (error) {
      throw error;
    }
  }

  const  updateGroup = async (id, body) => {
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

 const deleteGroup = async (id) => {
    try {
      const { data } = await ApiProvider.delete(
        `configurador/grupos/delete/${id}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  const createAccess = async (body) => {
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

  const  updateAccess = async (id, body) =>  {
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

  const  deleteAccess = async (id) => {
    try {
      const { data } = await ApiProvider.delete(
        `configurador/accesos/delete/${id}`
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  const configureParameters = async (idDashboard, body) => {
    try {
      const response = await ApiProvider.post(`configurador/dashboards/parameters/${idDashboard}`, body);
      return response;
    } catch (error) {
      throw error
    }
  }

  const getParameters = async (idDashboard) =>{
    try {
      const {data} = await ApiProvider.get(`configurador/dashboards/parameters/${idDashboard}`);
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
    replaceAccess
  };
}

