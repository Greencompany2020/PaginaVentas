import Image from 'next/image'
import { Flex } from './index'
import Settings from '@public/images/settings.png'

const ParametersContainer = ({ children }) => {
  return (
    <Flex className='flex-col border-b-2 border-gray-300 pl-3 pt-2'>
      <Flex className='m-auto xl:m-0'>
        <Image src={Settings} alt='parámetros' className='w-7 h-7' height={28} width={28}/>
        <p className='ml-3 font-bold'>Introduzca los parámetros para el reporte</p>
      </Flex>
      {children}
    </Flex>
  )
}

export default ParametersContainer
