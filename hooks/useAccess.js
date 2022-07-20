import { useState, useEffect } from "react";
import * as service from "../services/configuratorService";
import { useNotification } from "../components/notifications/NotificationsProvider";


export default function useAccess() {

  const sendNotification = useNotification();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [access, setAccess] = useState([]);

  useEffect(() => {
    (async () => {
      const userResponse = await service.getUsers();
      const groupsResponse = await service.getGroups();
      const accessResponse = await service.getAccess();

      setUsers(userResponse);
      setGroups(groupsResponse);
      setAccess(accessResponse);
    })();
  }, []);

  ////////////////INITIAL GET FUNCTIONS/////////
  const getUsers = async() => {
    const userResponse = await service.getUsers();
    setUsers(userResponse);
  }

  const getGroups = async() => {
    const groupsResponse = await service.getGroups();
    setGroups(groupsResponse);
  }

  const getAccess = async() => {
    const accessResponse = await service.getAccess();
    setAccess(accessResponse);
  }

  /////////////////USER FUNCTION/////////////////
  const getUserDetail = async (userId) => {
    try {
      const response = await service.getUserDetail(userId);
      const { Accesos, ...Usuario } = response;
      const formatedAcces = replaceAccess(access, Accesos)
      const formatedData = {
        userDetail: Usuario,
        userAccess:formatedAcces,
      };
      return formatedData;
    } catch (error) {

    }
  };

  const createUser = async (body) => {
    try {
      const response = await service.createUser(body);
      if(response) await getUsers();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al crear usuario'
      });
    }
  };

  const updateUser = async (userId, body) => {
    try {
      const {password, ...values} = body;
      const response = await service.updateUser(userId, values);
      if(response) await getUsers();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al actualizar usuario'
      });
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await service.deleteUser(userId);
      if(response) await getUsers();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al eliminar usuario'
      });
    }
  };

  const assignAccess = async(body) => {
    try {
      const response = await service.assignAccess(body);
      if(response) await getUserDetail(body.idUser);
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al asignar o actualizar permiso'
      });
    }
  }

  ////////////////GROUPS FUNCTIONS //////////////////////
  const createGroup = async (body) => {
    try {
      const response = await service.createGroup(body);
      if(response) await getGroups();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al crear grupo'
      });
    }
  };

  const updateGroup = async (groupId, body) => {
    try {
      const response = await service.updateGroup(groupId, body);
      if(response) await getGroups();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al actulizar grupo'
      });
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await service.deleteGroup(groupId);
      if(response) await getGroups();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al eliminar grupo'
      });
    }
  };

  //////////////ACCESS FUNCTIONS/////////////////
  const createAccess = async (body) => {
    try {
      const response = await service.createAccess(body);
      if(response) await getAccess();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al crear acceso usuario'
      });
    }
  };

  const updateAccess = async (accessId, body) => {
    try {
      const response = await service.updateAccess(accessId, body);
      if(response) await getAccess();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al actualizar acceso'
      });
    }
  };

  const deleteAccess = async (accessId) => {
    try {
      const response = await service.deleteAccess(accessId);
      if(response) await getAccess();
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al eliminar acceso'
      });
    }
  };

  const getParameters = async (idDashboard) => {
    try {
      const response = await service.getParameters(idDashboard);
      return response;
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:'Error al consultar los parametros'
      })
    }
  }

  const configureParameters = async (idDashboard, body) => {
    try {
      const response = await service.configureParameters(idDashboard, body);
    } catch (error) {
      sendNotification({
        type: 'ERROR',
        message: 'Errror al configurar los parametros'
      })
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
    users,
    groups,
    access,
    getUserDetail,
    createUser,
    updateUser,
    deleteUser,
    assignAccess,
    createAccess,
    updateAccess,
    deleteAccess,
    createGroup,
    updateGroup,
    deleteGroup,
    getParameters,
    configureParameters
  };
}

