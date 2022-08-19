import { useEffect, useRef, useState} from "react";
import DetailsSideBar from "./DetailsSideBar";
import { MenuIcon, XIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import useToggle from "../hooks/useToggle";
import useClickOutside from "../hooks/useClickOutside";
import { enlaces as enlacesMenuLateral } from "../utils/data";
import { isWindows, isAndroid, isChrome} from "react-device-detect";
import { useNotification } from "./notifications/NotificationsProvider";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import userLogout from "../redux/actions/userLogout";

const SideMenu = () => {
  const router = useRouter();
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const isFirst = router.pathname !== '/ventas'
  const [visible, toggleVisible] = useToggle(isFirst);
  const [showChevron, setShowChevron] = useState(false);
  const sendNotification = useNotification();


  const handleLogout = async() => {
    try {
        dispatch(userLogout());
        router.push('/');
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:error.message,
      });
    }
  };

  useClickOutside(menuRef, () => {
    if (!visible) {
      toggleVisible();
    }
  });

  const handleOnLeave = () => {
    if (!visible) {
      toggleVisible();
    }
  };

  useEffect(()=>{
    (()=>{
      setShowChevron(isWindows || isAndroid || isChrome)
    })()
  },[])

  return (
    <>
      <MenuIcon
        width={40}
        className=" text-sky-500 cursor-pointer hover:text-sky-400"
        onClick={toggleVisible}
        onMouseEnter={toggleVisible}
      />

      <aside
        ref={menuRef}
        className={`w-80 h-[calc(_100vh_-_3rem)] bg-black-light left-0 top-[3rem] z-40  transform fixed  ${
          visible && "-translate-x-full"
        } transition duration-200 ease-in-out shadow-md`}
        onMouseLeave={handleOnLeave}
      >
        <div className="flex flex-col h-full justify-between p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className=" text-white font-bold">Menu</h3>
            <XIcon
              width={24}
              className=" text-white cursor-pointer"
              onClick={toggleVisible}
            />
          </div>
          <div className=" flex-[2] overflow-y-auto pl-2">
            {enlacesMenuLateral.map(({ summaryText, links }) => (
              <DetailsSideBar
                key={summaryText}
                summaryText={summaryText}
                links={links}
                handleToggle={toggleVisible}
                showChevron={showChevron}
              />
            ))}
          </div>
          <div className="p-3 flex flex-row">
            <LogoutIcon width={32} className='text-sky-500'/>
            <button className="text-sky-500 pl-1 font-semibold" onClick={ handleLogout}>Cerrar sesion</button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideMenu;
