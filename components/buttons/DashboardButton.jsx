import Link from 'next/link';
import Image from 'next/image';
import DashboardIcon from '@public/images/dashboard-icon.png';

const DashboardButton = ({ name, link }) => {
  return (
    <Link href={link}>
      <a>
        <div className="w-[200px] md:w-[220px] lg:w-[220px] xl:w-[230px] h-40 lg:h-40 bg-gray-200 bg-opacity-50 rounded-lg flex flex-col items-center m-auto hover:scale-110 transition ease-in-out duration-200">
          <Image src={DashboardIcon} alt="Dashboard" className="h-32 w-44 object-contain" height={128} width={176}/>
          <p>{name}</p>
        </div>
      </a>
    </Link>
  )
}

export default DashboardButton
