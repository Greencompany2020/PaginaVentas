import React from "react";
import Navbar from "../../components/Navbar";
import Access from "../../components/access/access";
import useAccess from "../../hooks/useAccess";

export default function AccessView() {
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
      <Access
        data={accessHook.access}
        createAccess={accessHook.createAccess}
        updateAccess={accessHook.updateAccess}
        deleteAccess={accessHook.deleteAccess}
      />
    </>
  );
}

