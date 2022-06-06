import React from 'react';
import Navbar from '../../components/Navbar';

export default function GruposView() {
  return (
   <>
      <Navbar />
        <div className="flex flex-col md:flex-row justify-between h-fit p-4 md:p-8 bg-slate-50">
            <span className=" text-2xl font-semibold">Página de ventas</span>
            <span className=" text-3xl font-semibold">
            Configuración de Accesos
            </span>
        </div>
   </>
  )
}
