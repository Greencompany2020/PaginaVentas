import { useState, useEffect } from "react";
import * as service from "../services/AccessService";
import { useAlert } from "../context/alertContext";

const ALERT_SETTIME = 4000

export default function useAccess() {

  const alert = useAlert();
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
      const formatedAccess = replaceAccess(access, Accesos);
      const formatedData = {
        userDetail: Usuario,
        userAccess:formatedAccess,
      };
      return formatedData;
    } catch (error) {}
  };

  const createUser = async (body) => {
    try {
      const response = await service.createUser(body);
      if(response) await getUsers();
    } catch (error) {
      alert.showAlert('Error al crear usuario', 'warning', ALERT_SETTIME);
    }
  };

  const updateUser = async (userId, body) => {
    try {
      const {password, ...values} = body;
      const response = await service.updateUser(userId, values);
      if(response) await getUsers();
    } catch (error) {
      alert.showAlert('Error al actualizar usuario', 'warning', ALERT_SETTIME);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await service.deleteUser(userId);
      if(response) await getUsers();
    } catch (error) {
      alert.showAlert('Error al eliminar usuario', 'warning', ALERT_SETTIME);
    }
  };

  const assignAccess = async(body) => {
    try {
      const response = await service.assignAccess(body);
      if(response) await getUserDetail(body.idUser);
    } catch (error) {
      alert.showAlert('Error al asignar o actualizar permiso', 'warning', ALERT_SETTIME);
    }
  }

  ////////////////GROUPS FUNCTIONS //////////////////////
  const createGroup = async (body) => {
    try {
      const response = await service.createGroup(body);
      if(response) await getGroups();
    } catch (error) {
      alert.showAlert('Error al crear grupo', 'warning', ALERT_SETTIME);
    }
  };

  const updateGroup = async (groupId, body) => {
    try {
      const response = await service.updateGroup(groupId, body);
      if(response) await getGroups();
    } catch (error) {
      alert.showAlert('Error al actulizar grupo', 'warning', ALERT_SETTIME);
    }
  };

  const deleteGroup = async (groupId) => {
    try {
      const response = await service.deleteGroup(groupId);
      if(response) await getGroups();
    } catch (error) {
      alert.showAlert('Error al eliminar grupo', 'warning', ALERT_SETTIME);
    }
  };

  //////////////ACCESS FUNCTIONS/////////////////
  const createAccess = async (body) => {
    try {
      const response = await service.createAccess(body);
      if(response) await getAccess();
    } catch (error) {
      alert.showAlert('Error al crear acceso usuario', 'warning', ALERT_SETTIME);
    }
  };

  const updateAccess = async (accessId, body) => {
    try {
      const response = await service.updateAccess(accessId, body);
      if(response) await getAccess();
    } catch (error) {
      alert.showAlert('Error al actualizar acceso', 'warning', ALERT_SETTIME);
    }
  };

  const deleteAccess = async (accessId) => {
    try {
      const response = await service.deleteAccess(accessId);
      if(response) await getAccess();
    } catch (error) {
      alert.showAlert('Error al eliminar acceso', 'warning', ALERT_SETTIME);
    }
  };

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
    deleteGroup
  };
}

