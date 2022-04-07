// Componentes externos
import Image from 'next/image';
// Componentes propios
import { Flex } from '../containers'
// Funciones y hooks
// Recursos (img, js, css)
import Trend from '../../public/images/trend.png'

const VentasTableContainer = ({ children, title }) => {
  return (
    <Flex className='flex-col w-full lg:w-3/4 mt-2'>
      <Flex>
          <Image src={Trend} alt='' className='w-8 h-8 text-black' height={32} width={32}/>
          <p className='ml-3 font-bold'>{title}</p>
        </Flex>
        <div className='bg-gray-100 p-5 rounded-lg overflow-x-scroll'>
          {children}
        </div>
    </Flex>
  )
}

export default VentasTableContainer
