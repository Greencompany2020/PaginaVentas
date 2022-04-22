import DetailsSideBar from './DetailsSideBar';
import { MenuIcon } from '@heroicons/react/solid';
import useToggle from '../hooks/useToggle';

import { enlaces as enlacesMenuLateral } from '../utils/data'

const SideMenu = () => {
  const [visible, toggleVisible] = useToggle(true);
  return (
    <>
      <aside className={`w-56 lg:flex-none bg-gray-200 z-10 left-0 transform absolute lg:relative lg:translate-x-0 ${visible ? '-translate-x-full' : ''} transition duration-200 ease-in-out`}>
        <div className='pl-2 border-b-2 border-gray-300'>
          <MenuIcon className='h-9 w-9 text-black cursor-pointer' onClick={toggleVisible} />
          <p>Página inicial</p>
        </div>
        <div className='pl-2'>
          {
            enlacesMenuLateral.map(({ summaryText, links }) => (
              <DetailsSideBar key={summaryText} summaryText={summaryText} links={links} />
            ))
          }
        </div>
      </aside>
      <div className={`pl-1 pt-1 cursor-pointer lg:absolute relative left-0 z-0`}><MenuIcon className='h-9 w-9 text-black' onClick={toggleVisible} /></div>
    </>
  )
}

export default SideMenu
