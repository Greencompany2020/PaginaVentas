import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Flex } from "../components/containers";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Logo from "../public/images/green-company-logo.png";
import Menu from "../public/images/dot-menu.png";
import User from "../public/images/user-frogs.jpg";
import Cancel from "../public/icons/cancel-18.png";
import UserIcon from "../public/icons/icon_-users-4.png";
import Password from "../public/icons/password-11.png";
import Config from "../public/icons/config-5.png";
import Close from "../public/icons/close-37.png";
import useClickOutside from "../hooks/useClickOutside";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
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
      <nav className="w-full h-14 bg-black-shape flex items-center justify-between p-4">
        <Link href="/dashboard">
          <a href="">
            <Image src={Logo} alt="Logo Green Company" height={40} width={45} />
          </a>
        </Link>
        <div className="flex flex-row space-x-4">
          <Link href="/dashboard">
            <a className="ml-3 md:mr-4">
              <Image src={Menu} alt="menu" height={35} width={35} />
            </a>
          </Link>
          <Image
            src={User}
            alt="Arrow"
            className="rounded-full h-7 w-7"
            height={30}
            width={39}
          />
          <ChevronDownIcon
            className="text-white h-7 w-7 my-auto mx-2 cursor-pointer"
            onClick={handleToggle}
          />
        </div>
      </nav>
      {/* Menú Opciones Usuario */}
      <div
        ref={userMenuRef}
        className={`fixed w-[280px] h-[350px] z-10 p-4 right-0 transform bg-black-light ${
          !showDialog && "translate-x-full"
        }  transition duration-200 ease-in-out`}
      >
        <Flex className="flex-col w-full">
          <Flex className="flex-grow justify-evenly p-2">
            <p className="text-white text-lg font-bold">Opciones de cuenta</p>
            <Image
              src={Cancel}
              height={30}
              width={30}
              alt="Cerrar"
              className="invert cursor-pointer"
              onClick={handleToggle}
            />
          </Flex>
          <Link href="/usuario/perfil">
            <a className="hover:bg-sky-400 m-1 rounded-sm transition ease-in-out duration-200">
              <Flex className="justify-start mx-2  p-2">
                <Image
                  src={UserIcon}
                  height={20}
                  width={25}
                  alt="Cerrar"
                  className="invert"
                />
                <p className="text-white text-base ml-5">Mi Perfil</p>
              </Flex>
            </a>
          </Link>

          <Link href="/accesos">
            <a className="hover:bg-sky-400 m-1 rounded-sm transition ease-in-out duration-200">
              <Flex className="justify-start mx-2 p-2">
                <Image
                  src={Config}
                  height={20}
                  width={25}
                  alt="Cerrar"
                  className="invert"
                />
                <p className="text-white text-base ml-5">Configuraciones</p>
              </Flex>
            </a>
          </Link>
          <a
            className="hover:bg-sky-400 m-1 rounded-sm transition ease-in-out duration-200 cursor-pointer"
            onClick={handleLogout}
          >
            <Flex className="justify-start mx-2 p-2">
              <Image
                src={Close}
                height={20}
                width={25}
                alt="Cerrar"
                className="invert"
              />
              <p className="text-white text-base ml-5">Cerrar Sesión</p>
            </Flex>
          </a>
        </Flex>
      </div>
    </>
  );
};

export default Navbar;
