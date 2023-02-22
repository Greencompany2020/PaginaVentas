import React from "react";
import { UserIcon, UserGroupIcon, LockOpenIcon, GlobeIcon } from "@heroicons/react/solid";
import Link from "next/link";
export default function TabButton(props) {
  return (
    <div className="flex space-x-2">
      <Link href="/configuracion/usuarios">
        <a className="secondary-btn w-20 flex justify-center">
          <UserIcon width={32} className="" />
        </a>
      </Link>
      <Link href="/configuracion/grupos">
        <a className="secondary-btn w-20 flex justify-center">
          <UserGroupIcon width={32} className="" />
        </a>
      </Link>
      <Link href="/configuracion/accesos">
        <a className="secondary-btn w-20 flex justify-center">
          <LockOpenIcon width={32} className="" />
        </a>
      </Link>
      <Link href="/configuracion/proyectos">
        <a className="secondary-btn w-20 flex justify-center">
          <GlobeIcon width={32} className=""/>
        </a>
      </Link>
    </div>
  );
}

