import Link from "next/link";

const DashboardButtonContainer = ({ children, link }) => {
  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link href={link}>
      <div className=" flex justify-center bg-gray-200 w-56 h-52 rounded-2xl p-7 hover:scale-110 transition ease-in-out duration-200 truncate">
        <a>{children}</a>
      </div>
    </Link>
  );
};

export default DashboardButtonContainer;
