import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Plus from "../public/icons/plus.svg";

const DetailsSideBar = ({ summaryText, links, handleToggle }) => {
  const router = useRouter();
  const activeLink = (link) => {
    if (router.pathname === link) return "bg-sky-500 text-white";
    return "hover:bg-sky-400 hover:text-white";
  };
  const [open, setOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleOpen = () => {
    if (!open) setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const handleClicked = () => setClicked(!clicked);

  return (
    <details className="hover:block">
      <summary className="cursor-pointer flex items-center pb-2 text-white">
        <Image src={Plus} alt="Plus" height={16} width={16} />
        <span className="ml-1">{summaryText}</span>
      </summary>
      <ul>
        {links.map((item) => (
          <Link href={item.link} key={item.linkText}>
            <a onClick={handleToggle}>
              <li
                className={`pl-10 p-1 text-white  rounded-sm ${activeLink(
                  item.link
                )} transition-all ease-in-out duration-200`}
              >
                {item.linkText}
              </li>
            </a>
          </Link>
        ))}
      </ul>
    </details>
  );
};

export default DetailsSideBar;
