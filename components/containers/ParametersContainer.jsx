import { useState, useRef } from "react";
import { XIcon, AdjustmentsIcon } from "@heroicons/react/solid";
import useClickOutside from "../../hooks/useClickOutside";

const ParametersContainer = ({ children }) => {
  const container = useRef(null);
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => setToggle(!toggle);

  useClickOutside(container, () => {
    if (toggle) {
      handleToggle();
    }
  });
  const handleHover = () => {
    if (!toggle) {
      handleToggle();
    }
  };
  const handleLeave = (evt) => {
    let target = true;
    if (
      evt._targetInst.elementType == "select" ||
      evt._targetInst.elementType == "input"
    ) {
      target = false;
    }
    if (toggle && target) {
      handleToggle();
    }
  };
  return (
    <>
      <div className="relative p-2">
        <div className="flex items-center space-x-2">
          <p className=" font-semibold">Filtros</p>
          <button
            className=" bg-slate-200 hover:bg-slate-300 rounded-md h-8 w-12 flex items-center justify-center"
            onClick={handleToggle}
            onMouseOver={handleHover}
          >
            <AdjustmentsIcon width={26} className=" text-slate-600" />
          </button>
        </div>

        <div
          className={`absolute w-[24rem] h-min[24rem] h-[28rem] left-0 top-11 bg-slate-200 rounded-md ${
            !toggle && "hidden"
          }`}
          ref={container}
          onMouseLeave={handleLeave}
        >
          <div className="flex flex-col h-full w-full p-4">
            <XIcon
              width={28}
              className="cursor-pointer text-slate-500 self-end"
              onClick={handleToggle}
            />
            <p className="font-semibold pb-4 text-lg">Parametros de busqueda</p>
            <div className="flex-[2] overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParametersContainer;
