import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import Plus from '../public/icons/plus.svg';

const DetailsSideBar = ({ summaryText, links }) => {
  const router = useRouter();

  const activeLink = (link) => {
    if (router.pathname === link) return "bg-gray-600 text-white"
    return "hover:bg-gray-600 hover:text-white"
  }

  return (
    <details>
      <summary className='cursor-pointer flex items-center'>
        <Image src={Plus} alt='Plus' height={16} width={16} />
        <span className='ml-1'>{summaryText}</span>
      </summary>
      <ul>
        {
          links.map(item => (
            <Link href={item.link} key={item.linkText} passHref>
              <li className={`pl-5 p-1 border-b-2 border-gray-300 cursor-pointer ${activeLink(item.link)} rounded-md transition ease-in-out duration-200`}>
                <a>{item.linkText}</a>
              </li>
            </Link>
          ))
        }
      </ul>
    </details>
  )
};

export default DetailsSideBar;
