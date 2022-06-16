import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Logo from "../public/images/green-company-logo.png";
import Menu from "../public/images/dot-menu.png";
import UserIcon from "../public/icons/icon_-users-4.png";
import Config from "../public/icons/config-5.png";
import useClickOutside from "../hooks/useClickOutside";
import useAuth from "../hooks/useAuth";
import { XIcon } from "@heroicons/react/solid";
import { LogoutIcon } from "@heroicons/react/outline";
import Avatar from "./commons/Avatar";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const {user} = useUser();
  const userMenuRef = useRef(null);
  const [showDialog, setShowDialog] = useState(false);
  const auth = useAuth();
  const handleToggle = () => setShowDialog(!showDialog);

  useClickOutside(userMenuRef, () => {
    if (showDialog) {
      handleToggle();
    }
  });

  const handleLogout = () => {
    auth.logOut();
  };

  return (
    <>
      <nav className="w-full h-[3rem] bg-black-shape flex items-center justify-between pl-4 pr-4">
        <Link href="/dashboard">
          <a href="">
            <Image src={Logo} alt="Logo Green Company" height={40} width={45} />
          </a>
        </Link>
        <div className="flex flex-row items-center space-x-2">
          <figure>
            <Link href="/dashboard">
              <a>
                <Image src={Menu} alt="menu" height={40} width={40} />
              </a>
            </Link>
          </figure>
          <figure>
            <Avatar image={user?.ImgPerfil} size={38}/>
          </figure>
          <figure>
            <ChevronDownIcon
              className="text-white h-7 w-7 my-auto cursor-pointer"
              onClick={handleToggle}
            />
          </figure>
        </div>
      </nav>

      {/* Menú Opciones Usuario */}
      <div
        ref={userMenuRef}
        className={`fixed w-[280px] h-[250px] z-10 right-0 transform bg-black-light ${
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
              <a className="hover:bg-sky-400 m-1 flex p-2 rounded-sm transition ease-in-out duration-200">
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

            <Link href="/accesos">
              <a className="hover:bg-sky-400 m-1 flex  p-2 rounded-sm transition ease-in-out duration-200">
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
