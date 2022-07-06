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
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";
import jsCookie from "js-cookie";
import { useNotification } from "./notifications/NotificationsProvider";

const Navbar = () => {
  const {user} = useAuth();
  const service = authService();
  const userMenuRef = useRef(null);
  const sendNotification = useNotification();
  const [showDialog, setShowDialog] = useState(false);
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
        jsCookie.remove('jwt');
        window.location.href = '/';
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
        <div className="flex pl-4 pr-4  h-full justify-between">
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
              <Avatar image={user?.ImgPerfil} size={3}/>
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
        className={`absolute w-[280px] h-[250px] z-50 right-0 transform bg-black-light ${
          !showDialog && "translate-x-full"
        }  transition duration-200 ease-in-out`}
      >
        <div className="flex flex-col justify-between p-4">
          <div className="flex justify-start ">
            <XIcon
              width={32}
              className=" text-white cursor-pointer"
              onClick={handleToggle}
            />
          </div>
          <div className="mb-4 pl-8">
            <h3 className=" text-white text-xl">Opciones de cuenta</h3>
          </div>
          <div className="pl-10 space-y-1">
            <Link href="/usuario/perfil">
              <a 
                className="hover:bg-sky-400 m-1 flex p-2 rounded-sm transition ease-in-out duration-200"
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
                className="hover:bg-sky-400 m-1 flex  p-2 rounded-sm transition ease-in-out duration-200"
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
              className="hover:bg-sky-400 m-1 flex rounded-sm  p-2 transition ease-in-out duration-200 cursor-pointer"
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
