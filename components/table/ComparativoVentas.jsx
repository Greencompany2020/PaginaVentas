import Image from 'next/image';
// Componentes propios
import { Flex } from '../containers';
// Funciones y hooks
// Recursos (img, js, css)
import Trend from '../../public/images/trend.png';

const ComparativoVentas = ({ children}) => {
  return (
    <Flex className='flex-col w-full lg:w-3/4 mt-2'>

        <div className='bg-gray-100 p-5 rounded-lg overflow-x-scroll'>
          {children}
        </div>
    </Flex>
  )
}

export default ComparativoVentas
