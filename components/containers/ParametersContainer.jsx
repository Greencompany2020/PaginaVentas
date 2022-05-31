import { useState } from "react";
import { XIcon, FilterIcon } from "@heroicons/react/solid";

const ParametersContainer = ({ children }) => {
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => setToggle(!toggle);
  return (
    <>
      <div className="relative mb-1 pb-1 p-2 ">
        <div className="flex items-center space-x-2">
          <p className=" text-lg">Filtros</p>
          <button
            className=" bg-slate-200 hover:bg-slate-300 rounded-md h-8 w-12 flex items-center justify-center"
            onClick={handleToggle}
          >
            <FilterIcon width={26} className=" text-slate-600" />
          </button>
        </div>
        <div
          className={`absolute p-4 left-16 top-11 bg-slate-200 border-2 rounded-md ${
            !toggle && "hidden"
          }`}
        >
          <XIcon
            width={28}
            className="absolute right-1 top-1 cursor-pointer text-slate-500"
            onClick={handleToggle}
          />
          <p className="font-semibold mb-4 text-lg">Parametros de busqueda</p>
          {children}
        </div>
      </div>
    </>
  );
};

export default ParametersContainer;
