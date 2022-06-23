import React from "react";
import Groups from "../../components/access/groups";
import useAccess from "../../hooks/useAccess";
import withAuth from "../../components/withAuth";
import TabButton from "../../components/access/TabButton";
import { getBaseLayout } from "../../components/layout/BaseLayout";
const GruposView = () => {
  const accessHook = useAccess();
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between h-fit p-4 md:p-8 bg-slate-50">
        <span className=" text-2xl font-semibold">Página de ventas</span>
        <span className=" text-3xl font-semibold">Configuración de Grupos</span>
      </div>
      <div className="flex mt-2 pl-8 pr-8 md:pl-8 md:pr-8 space-x-3">
        <TabButton />
      </div>
      <Groups
        data={accessHook.groups}
        createGroup={accessHook.createGroup}
        updateGroup={accessHook.updateGroup}
        deleteGroup={accessHook.deleteGroup}
      />
    </>
  );
};

const GruposViewWithAuth = withAuth(GruposView);
GruposViewWithAuth.getLayout = getBaseLayout;
export default GruposViewWithAuth


