// Componentes externos
import Image from 'next/image';
// Componentes propios
import { Flex } from '../containers'
// Funciones y hooks
// Recursos (img, js, css)
import Trend from '../../public/images/trend.png'

const VentasTableContainer = ({ children}) => {
  return (
    <Flex className='flex-col w-full p-4 md:p-8'>
        <div className=' bg-gray-100 p-5 rounded-lg overflow-x-scroll'>
          {children}
        </div>
    </Flex>
  )
}

export default VentasTableContainer
