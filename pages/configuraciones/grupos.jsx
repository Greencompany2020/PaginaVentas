import React from "react";
import witAuth from "../../components/withAuth";
import Navbar from "../../components/Navbar";
import Groups from "../../components/access/groups";
import useAccess from "../../hooks/useAccess";
import TabButton from "../../components/access/users/TabButton";

export default function Grupos() {
  const accessHook = useAccess();
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between h-fit p-4 md:p-8">
        <span className=" text-2xl font-semibold">Página de ventas</span>
        <span className=" text-3xl font-semibold">Configuración de Grupos</span>
      </div>

      <div className="bg-slate-50 h-14 flex items-center p-4 md:p-8 space-x-4">
        <TabButton />
      </div>

      <main>
        <Groups
          data={accessHook.groups}
          createGroup={accessHook.createGroup}
          updateGroup={accessHook.updateGroup}
          deleteGroup={accessHook.deleteGroup}
        />
      </main>
    </>
  );
}

