import Image from 'next/image';
import { LockClosedIcon, EyeIcon, CogIcon} from '@heroicons/react/outline'
import DashboardIcon from '../../public/images/dashboard-icon.png';
const DashboardItem = () =>{
    return(
        <div className="flex w-[20rem] h-[9rem] bg-gray-200 rounded-md p-4">
            <figure className="flex-[3]  flex flex-col flex-nowrap items-start">
                <Image src={DashboardIcon} alt="Dashboard" className=" object-cover" height={128} width={176}/>
                <figcaption className='text-lg font-semibold'>Tiendas</figcaption>
            </figure>
            <div className="flex-[1] grid place-items-center ">
               <LockClosedIcon className='w-[26px] cursor-pointer text-gray-500'/>
               <EyeIcon className='w-[26px] cursor-pointer text-gray-500'/>
               <CogIcon className='w-[26px] cursor-pointer text-gray-500 hover:text-blue-500'/>
            </div>
        </div>
    )
}

export default DashboardItem;