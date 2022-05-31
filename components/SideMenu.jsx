import DetailsSideBar from "./DetailsSideBar";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import useToggle from "../hooks/useToggle";
import useAuth from "../hooks/useAuth";

import { enlaces as enlacesMenuLateral } from "../utils/data";
const SideMenu = () => {
  const auth = useAuth();
  const [visible, toggleVisible] = useToggle(false);
  return (
    <>
      <MenuIcon
        width={40}
        className="absolute text-sky-500 cursor-pointer hover:text-sky-400 ml-1 top-14 left-1"
        onClick={toggleVisible}
      />

      <aside
        className={`w-80 h-full bg-black-light left-0 z-40  transform fixed  ${
          visible && "-translate-x-full"
        } transition duration-200 ease-in-out`}
      >
        <div className="flex justify-end p-2">
          <XIcon
            width={32}
            className=" text-white cursor-pointer"
            onClick={toggleVisible}
          />
        </div>
        <div className="p-4 h-[80%]">
          <div className="h-full overflow-y-auto">
            {enlacesMenuLateral.map(({ summaryText, links }) => (
              <DetailsSideBar
                key={summaryText}
                summaryText={summaryText}
                links={links}
              />
            ))}
          </div>
        </div>
        <div className="p-4 h-[10%] flex items-center">
          <a href="#" onClick={auth.logOut} className=" text-sky-500">
            Cerrar sesion
          </a>
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
