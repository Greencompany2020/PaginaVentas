import React from "react";
import witAuth from "../../components/withAuth";
import Navbar from "../../components/Navbar";
import Users from "../../components/access/users";
import useAccess from "../../hooks/useAccess";
import TabButton from "../../components/access/users/TabButton";

export default function Usuarios() {
  const accessHook = useAccess();
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between h-fit p-4 md:p-8">
        <span className=" text-2xl font-semibold">Página de ventas</span>
        <span className=" text-3xl font-semibold">
          Configuración de Usuarios
        </span>
      </div>

      <div className="bg-slate-50 h-14 flex items-center p-4 md:p-8 space-x-4">
        <TabButton />
      </div>

      <main>
        <Users
          data={accessHook.users}
          groups={accessHook.groups}
          getUserDetail={accessHook.getUserDetail}
          createUser={accessHook.createUser}
          updateUser={accessHook.updateUser}
          deleteUser={accessHook.deleteUser}
          assignAccess={accessHook.assignAccess}
          access={accessHook.access}
        />
      </main>
    </>
  );
}

