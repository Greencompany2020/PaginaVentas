import React from "react";
import { UserIcon, UserGroupIcon, LockOpenIcon } from "@heroicons/react/solid";
import Link from "next/link";
export default function TabButton(props) {
  return (
    <>
      <Link href="/accesos/usuarios">
        <button className="secondary-btn w-20 flex justify-center">
          <UserIcon width={32} className="" />
        </button>
      </Link>
      <Link href="/accesos/grupos">
        <button className="secondary-btn w-20 flex justify-center">
          <UserGroupIcon width={32} className="" />
        </button>
      </Link>
      <Link href="/accesos/permisos">
        <button className="secondary-btn w-20 flex justify-center">
          <LockOpenIcon width={32} className="" />
        </button>
      </Link>
    </>
  );
}

