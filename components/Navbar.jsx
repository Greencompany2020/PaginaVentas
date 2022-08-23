import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/solid";
import logo from "../public/images/logo.svg";
import home from "../public/images/dot-menu.png";
import UserIcon from "../public/icons/icon_-users-4.png";
import Config from "../public/icons/config-5.png";
import useClickOutside from "../hooks/useClickOutside";
import { XIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import Avatar from "./commons/Avatar";
import { useNotification } from "./notifications/NotificationsProvider";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import jsCookie from 'js-cookie';
import removeInitialData from "../redux/actions/removeInitialData";
import authService from "../services/authService";

const Navbar = () => {
  const {user} = useSelector(state => state);
  const router  = useRouter();
  const dispatch = useDispatch();
  const userMenuRef = useRef(null);
  const sendNotification = useNotification();
  const [showDialog, setShowDialog] = useState(false);
  const service = authService();
  const handleToggle = () => setShowDialog(!showDialog);
  

  useClickOutside(userMenuRef, () => {
    if (showDialog) {
      handleToggle();
    }
  });

  const handleLogout = async() => {
    try {
        await service.logout();
        jsCookie.remove('accessToken');
        dispatch(removeInitialData());
        router.push('/')
    } catch (error) {
      sendNotification({
        type:'ERROR',
        message:error.message,
      });
    }
  };

  return (
    <>
      <nav className="w-full h-[3rem] bg-black-shape">
        <div className="flex  h-full justify-between">
            <Link href={'/dashboard'}>
              <a>
                <figure className="relative w-[3rem] h-[3rem]">
                  <Image src={logo} layout='fill'  alt="logo" objectFit="cover" objectPosition="center"/>
                </figure>
              </a>
            </Link>
            <section className=" h-full flex items-center space-x-2 ">
              <Link href={'/dashboard'}>
                <a>
                  <figure className="relative w-[3rem] h-[3rem]">
                    <Image src={home} layout='fill' alt="home" objectFit="cover" objectPosition="center"/>
                  </figure>
                </a>
              </Link>
              <figure className=" w-[3rem] h-[3rem] p-1">
                <Avatar image={user?.ImgPerfil}/>
              </figure>
              <figure>
                <ChevronDownIcon
                  className="text-white h-7 w-7 my-auto cursor-pointer"
                  onClick={handleToggle}
                />
              </figure>
            </section>
        </div>
      </nav>

      {/* Menú Opciones Usuario */}
      <div
        ref={userMenuRef}
        className={`absolute w-[280px] h-[190px] z-50 right-0 transform bg-black-light ${
          !showDialog && "translate-x-full"
        }  transition duration-200 ease-in-out shadow-md`}
      >
        <div className="flex flex-col justify-between p-4 relative space-y-3">
          <div className="flex items-center space-x-3">
            <XIcon
              width={24}
              className=" text-white cursor-pointer"
              onClick={handleToggle}
            />
             <h3 className=" text-white font-bold">Opciones de cuenta</h3>
          </div>
          <div className="space-y-1">
            <Link href="/usuario/perfil">
              <a 
                className="hover:bg-sky-400 m-1 flex p-1 rounded-sm transition ease-in-out duration-200"
                onClick={handleToggle}
              >
                <Image
                  src={UserIcon}
                  height={20}
                  width={25}
                  alt="Cerrar"
                  className="invert"
                />
                <p className="text-white pl-1">Mi Perfil</p>
              </a>
            </Link>

            <Link href="/configuracion/usuarios">
              <a 
                className="hover:bg-sky-400 m-1 flex  p-1 rounded-sm transition ease-in-out duration-200"
                onClick={handleToggle}
              >
                <Image
                  src={Config}
                  height={20}
                  width={25}
                  alt="Cerrar"
                  className="invert"
                />
                <p className="text-white pl-1">Configuraciones</p>
              </a>
            </Link>

            <a
              className="hover:bg-sky-400 m-1 flex rounded-sm  p-1 transition ease-in-out duration-200 cursor-pointer"
              onClick={handleLogout}
            >
              <LogoutIcon width={25} className="text-white" />
              <p className="text-white pl-1">Cerrar Sesión</p>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
