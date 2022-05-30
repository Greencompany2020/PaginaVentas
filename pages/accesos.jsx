import { useState } from "react";
import useAccess from "../hooks/useAccess";
import Navbar from "../components/Navbar";
import withAuth from "../components/withAuth";
import Users from "../components/access/users";
import Groups from "../components/access/groups";
import Access from "../components/access/access";
import TabButton from "../components/access/users/TabButton";

const Accesos = () => {
  const accessHook = useAccess();
  const [tabActive, setTabActive] = useState(1);
  const handleDeleteAccess = async (id) => {
    const confirm = await confirmModalRef.current.show();
    if (confirm) {
      deleteAccess(id);
    }
  };

  const RenderTab = () => {
    if (tabActive == 1) {
      return (
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
      );
    }

    if (tabActive == 2) {
      return (
        <Groups
          data={accessHook.groups}
          createGroup={accessHook.createGroup}
          updateGroup={accessHook.updateGroup}
          deleteGroup={accessHook.deleteGroup}
        />
      );
    }

    if (tabActive == 3) {
      return (
        <Access
          data={accessHook.access}
          createAccess={accessHook.createAccess}
          updateAccess={accessHook.updateAccess}
          deleteAccess={accessHook.deleteAccess}
        />
      );
    }

    return <></>;
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-between h-fit p-4 md:p-8">
        <span className=" text-2xl font-semibold">Página de ventas</span>
        <span className=" text-3xl font-semibold">
          Configuración de Accesos
        </span>
      </div>

      <div className="bg-slate-50 h-14 flex items-center p-4 md:p-8 space-x-4">
        <TabButton setActive={setTabActive} tabActive={tabActive} />
      </div>

      <main>
        <RenderTab />
      </main>
    </>
  );
};

export default withAuth(Accesos);

