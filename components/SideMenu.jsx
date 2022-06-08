import { useRef } from "react";
import DetailsSideBar from "./DetailsSideBar";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import useToggle from "../hooks/useToggle";
import useAuth from "../hooks/useAuth";
import useClickOutside from "../hooks/useClickOutside";

import { enlaces as enlacesMenuLateral } from "../utils/data";

const SideMenu = () => {
  const menuRef = useRef(null);
  const auth = useAuth();
  const [visible, toggleVisible] = useToggle(false);

  useClickOutside(menuRef, () => {
    if (!visible) {
      toggleVisible();
    }
  });

  return (
    <>
      <MenuIcon
        width={40}
        className=" text-sky-500 cursor-pointer hover:text-sky-400"
        onClick={toggleVisible}
      />

      <aside
        ref={menuRef}
        className={`w-80 h-[calc(_100vh_-_3rem)] bg-black-light left-0 top-[3rem] z-40  transform fixed  ${
          visible && "-translate-x-full"
        } transition duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full justify-between p-4">
          <div className="flex justify-end ">
            <XIcon
              width={32}
              className=" text-white cursor-pointer"
              onClick={toggleVisible}
            />
          </div>
          <div className="mb-4">
            <h3 className=" text-white text-2xl">Menu</h3>
          </div>
          <div className=" flex-[2] overflow-y-auto pl-2">
            {enlacesMenuLateral.map(({ summaryText, links }) => (
              <DetailsSideBar
                key={summaryText}
                summaryText={summaryText}
                links={links}
              />
            ))}
          </div>
          <div className="p-3">
            <a
              href="#"
              onClick={auth.logOut}
              className="flex flex-row items-center  text-sky-500"
            >
              <LogoutIcon width={32} />
              <p className="text-sky-500 pl-1">Cerrar Sesión</p>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
