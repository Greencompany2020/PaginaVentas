import Link from 'next/link';
import Image from 'next/image';
import Plus from '@public/icons/plus.svg';

const DetailsSideBar = ({ summaryText, links }) => {
  return (
    <details>
      <summary className='cursor-pointer flex items-center'>
        <Image src={Plus} alt='Plus' height={16} width={16}/>
        <span className='ml-1'>{summaryText}</span>
      </summary>
      <ul>
        {
          links.map(item => (
            <li className='pl-5 p-1 border-b-2 border-gray-300 hover:bg-gray-600 hover:text-white rounded-md transition ease-in-out duration-200' key={item.linkText}>
              <Link href={item.link}><a>{item.linkText}</a></Link>
            </li>
          ))
        }
      </ul>
    </details>
  )
};

export default DetailsSideBar;
