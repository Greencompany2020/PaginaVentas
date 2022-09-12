import { useState, useRef } from "react";
import Image from "next/image";
import { XIcon} from "@heroicons/react/solid";
import useClickOutside from "../../hooks/useClickOutside";
import filter from '../../public/icons/filter.svg';

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
      evt._targetInst.elementType == "input"  ||
      evt._targetInst.elementType == "span"   ||
      evt._targetInst.elementType == "div"
    ) {
      target = false;
    }
    if (toggle && target) {
      handleToggle();
    }
  };
  return (
    <>
      <div className="relative">
        <div className="flex items-center space-x-2">
          <p className=" font-semibold">Filtros</p>
          <button
            className={` bg-slate-200 hover:bg-blue-400 rounded-md h-8 w-12 flex items-center justify-center ${toggle && 'bg-blue-400'}`}
            onClick={handleToggle}
            onMouseOver={handleHover}
          >
            <figure>
              <Image src={filter}  width={24} alt={'icon'}/>
            </figure>
          </button>
        </div>

        <div
          className={`
            absolute w-[21.5rem] md:w-[23rem] h-min-fit h-max[28rem] top-9 border border-slate-400 bg-slate-200 rounded-md z-20  ${!toggle && "hidden"}`}
          ref={container}
          onMouseLeave={handleLeave}
        >
          <div className="flex flex-col h-full w-full p-4 space-y-2">
            <section className="flex justify-between">
              <h3 className="font-semibold">Filtros de búsqueda</h3>
              <XIcon
                width={28}
                className="cursor-pointer text-slate-500"
                onClick={handleToggle}
              />
            </section>
            <section className="flex-[2] overflow-y-auto">
              <div className="p-2">
                {children}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParametersContainer;
