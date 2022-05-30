import DetailsSideBar from "./DetailsSideBar";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import useToggle from "../hooks/useToggle";
import useAuth from "../hooks/useAuth";

import { enlaces as enlacesMenuLateral } from "../utils/data";
const SideMenu = () => {
  const auth = useAuth();
  const [visible, toggleVisible] = useToggle(true);
  return (
    <>
      <MenuIcon
        width={40}
        className="absolute text-sky-500 cursor-pointer hover:text-sky-400 ml-1 top-1 left-1"
        onClick={toggleVisible}
      />

      <aside
        className={`w-60  bg-gray-100 left-0 z-40  transform absolute  ${
          visible ? "-translate-x-full" : ""
        } transition duration-200 ease-in-out`}
      >
        <div className="flex justify-end p-2">
          <XIcon
            width={32}
            className=" text-slate-500 cursor-pointer"
            onClick={toggleVisible}
          />
        </div>
        <div className="p-4">
          {enlacesMenuLateral.map(({ summaryText, links }) => (
            <DetailsSideBar
              key={summaryText}
              summaryText={summaryText}
              links={links}
            />
          ))}
          <a href="#" onClick={auth.logOut} className=" text-sky-500">
            Salir
          </a>
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
