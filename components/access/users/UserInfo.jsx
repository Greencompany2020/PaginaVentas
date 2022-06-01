import React from 'react';
import Image from 'next/image';
import Verify from '../../../public/icons/ok-08.png';

export default function UserInfo({item}) {
  return (
    <div className="grid gap-4 md:grid-cols-6">
      <div className="flex flex-col space-y-2 relative w-[150px] md:w-full">
        <label htmlFor="" className="text-md font-bold text-gray-600">
          Empleado
        </label>
        <figure className="relative">
          <input
            type="text"
            className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold w-full"
            disabled
            placeholder={item?.NoEmpleado}
          />
          <span className=" absolute top-1 right-0">
            <Image src={Verify} height={30} width={30} alt="OK" />
          </span>
        </figure>
      </div>

      <div className="flex flex-col space-y-2 md:col-span-3">
        <label htmlFor="" className="text-md font-bold text-gray-600">
          Nombre
        </label>
        <input
          type="text"
          className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
          disabled
          placeholder={item?.Nombre}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="" className="text-md font-bold text-gray-600">
          User Level
        </label>
        <input
          type="text"
          className="outline-none border-2 h-10 rounded-md pl-3  placeholder:font-semibold"
          disabled
          placeholder={item?.Level}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="" className="text-md font-bold text-gray-600">
          Clase
        </label>
        <input
          type="text"
          className="outline-none border-2 h-10 rounded-md pl-3 placeholder:text-md  placeholder:font-semibold"
          disabled
          placeholder={item?.Clase}
        />
      </div>
    </div>
  );
}

