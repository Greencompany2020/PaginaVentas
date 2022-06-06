import React from "react";
import { UserIcon, UserGroupIcon, LockOpenIcon } from "@heroicons/react/solid";

export default function TabButton(props) {
  const { setActive, tabActive } = props;
  return (
    <>
      <button
        className={`secondary-btn w-20 flex justify-center ${
          tabActive == 1 ? "bg-slate-500" : "bg-red-400"
        }`}
        onClick={() => setActive(1)}
      >
        <UserIcon width={32} className="" />
      </button>
      <button
        className="secondary-btn w-20 flex justify-center"
        onClick={() => setActive(2)}
      >
        <UserGroupIcon width={32} className="" />
      </button>
      <button
        className="secondary-btn w-20 flex justify-center"
        onClick={() => setActive(3)}
      >
        <LockOpenIcon width={32} className="" />
      </button>
    </>
  );
}

