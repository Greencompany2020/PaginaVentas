import Link from "next/link";

const DashboardButtonContainer = ({ children, link }) => {
  return (
    <div className=" flex justify-center bg-gray-200 w-56 h-52 rounded-2xl p-7 hover:scale-110 transition ease-in-out duration-200 truncate">
      <a href={link}>{children}</a>
    </div>
  );
};

export default DashboardButtonContainer;
