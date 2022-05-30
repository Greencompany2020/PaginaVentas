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
  useClickOutside(userMenuRef, () => {
    setShowDialog(false);
  });

  const handleLogout = () => {
    auth.logOut();
  };
  return (
    <>
      <nav className="w-full h-14 bg-black flex items-center justify-between pl-3 md:pl-7">
        <Link href="/dashboard">
          <a href="">
            <Image src={Logo} alt="Logo Green Company" height={40} width={45} />
          </a>
        </Link>
        <Flex>
          <Link href="/dashboard">
            <a className="ml-3 md:mr-4">
              <Image src={Menu} alt="menu" height={35} width={35} />
            </a>
          </Link>
          <Flex>
            <Image
              src={User}
              alt="Arrow"
              className="rounded-full h-7 w-7"
              height={30}
              width={39}
            />
            <ChevronDownIcon
              className="text-white h-7 w-7 my-auto mx-2 cursor-pointer"
              onClick={() => setShowDialog(true)}
            />
          </Flex>
        </Flex>
      </nav>
      {/* Menú Opciones Usuario */}
      <div
        ref={userMenuRef}
        className={`bg-black opacity-80 border-2 border-gray-100 absolute w-[280px] h-[350px] z-10 ${
          showDialog
            ? "right-0 transform scale-100 transition ease-in-out duration-200"
            : "-right-1/4 transform scale-0 transition ease-in-out duration-200"
        } h-20 flex justify-center items-start p-1 rounded-md`}
      >
        <Flex className="flex-col w-full">
          <Flex className="flex-grow justify-evenly border-b border-b-gray-100 p-2">
            <p className="text-white text-lg font-bold">Opciones de cuenta</p>
            <Image
              src={Cancel}
              height={30}
              width={30}
              alt="Cerrar"
              className="invert cursor-pointer"
              onClick={() => setShowDialog(false)}
            />
          </Flex>
          <Link href="/usuario/perfil">
            <a className="hover:bg-sky-500 hover:bg-opacity-20 rounded-md transition ease-in-out duration-200">
              <Flex className="justify-start mx-2 border-b border-b-gray-100 p-2">
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
            <a className="hover:bg-sky-500 hover:bg-opacity-20 rounded-md transition ease-in-out duration-200">
              <Flex className="justify-start mx-2 border-b border-b-gray-100 p-2">
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
            className="hover:bg-sky-500 hover:bg-opacity-20 rounded-md transition ease-in-out duration-200 cursor-pointer"
            onClick={handleLogout}
          >
            <Flex className="justify-start mx-2 border-b border-b-gray-100 p-2">
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
