import React from 'react';
import Navbar from '../../components/Navbar';
import Users from '../../components/access/users';
import useAccess from '../../hooks/useAccess';

export default function UsersView() {
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
  )
}
