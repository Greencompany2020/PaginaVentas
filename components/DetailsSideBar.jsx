import { useRouter } from "next/router";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/solid";

const DetailsSideBar = ({ summaryText, links }) => {
  const router = useRouter();
  const activeLink = (link) => {
    if (router.pathname === link) return "bg-sky-500 text-white";
    return "hover:bg-sky-400 hover:text-white";
  };

  return (
    <details>
      <summary className="cursor-pointer flex items-center pb-2 text-white">
        <ChevronRightIcon width={16} />
        <span className="ml-1">{summaryText}</span>
      </summary>
      <ul>
        {links.map((item) => (
          <Link href={item.link} key={item.linkText}>
            <a>
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
