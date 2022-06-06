import React from "react";
import Navbar from "../../components/Navbar";
import Groups from "../../components/access/groups";
import useAccess from "../../hooks/useAccess";

export default function GruposView() {
  const accessHook = useAccess();
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between h-fit p-4 md:p-8 bg-slate-50">
        <span className=" text-2xl font-semibold">Página de ventas</span>
        <span className=" text-3xl font-semibold">
          Configuración de Accesos
        </span>
      </div>

      <Groups
        data={accessHook.groups}
        createGroup={accessHook.createGroup}
        updateGroup={accessHook.updateGroup}
        deleteGroup={accessHook.deleteGroup}
      />
    </>
  );
}

