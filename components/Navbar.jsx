import Image from 'next/image';
import Link from 'next/link';
import { Flex } from '@components/containers';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Logo from '@public/images/green-company-logo.png';
import Menu from '@public/images/dot-menu.png';
import User from '@public/images/user-frogs.jpg';

const Navbar = () => {
  return (
    <nav className="w-full h-14 bg-black flex items-center justify-between pl-3 md:pl-7">
      <Image src={Logo} alt="Logo Green Company" height={40} width={45}/>
      <Flex>
        <Link href="/dashboard"><a className='ml-3 md:mr-4'><Image src={Menu} alt="menu" height={35} width={35}/></a></Link>
        <Flex className="cursos-pointer">          
          <Image src={User} alt="Arrow" className="rounded-full h-7 w-7" height={30} width={39}/>
          <ChevronDownIcon className="text-white h-7 w-7" />
        </Flex>
      </Flex>
    </nav>
  );
};

export default Navbar;
