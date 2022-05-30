import { useState } from 'react'
import {AdjustmentsIcon, XIcon} from '@heroicons/react/solid'

const ParametersContainer = ({ children }) => {
  const [toggle, setToggle] = useState(false);
  const handleToggle = () => setToggle(!toggle);
  return (
    <>
      <figure className='fixed top-32 left-1 rounded-full z-10 border-2 p-1 bg-slate-500 cursor-pointer'>
        <AdjustmentsIcon 
          width={34}
          className=' text-gray-100'
          onClick={handleToggle}
        />
      </figure>
      <div className={`fixed w-[90%] md:w-fit top-[180px] left-2 z-30 p-4 md:left-3 bg-slate-50 border-2 rounded-md ${!toggle && 'hidden'}`}>
        <XIcon width={28} className='absolute right-1 top-1 cursor-pointer text-slate-500' onClick={handleToggle}/>
        <p className='font-semibold mb-4 text-lg'>Parametros de busqueda</p>
        {children}
      </div>
    </>
  )
}

export default ParametersContainer
