import Image from 'next/image'
import React from 'react'
import { Flex } from '../containers'
import Close from '../../public/icons/close.svg';

const MessageModal = ({ modalOpen, setModalOpen, message }) => {
  return (
    <div className={`bg-black border-2 border-gray-100 absolute w-4/5 sm:w-2/3 lg:w-1/3 ${modalOpen ? 'top-1/4 transform scale-100 transition ease-in-out duration-200' : '-top-1/4 transform scale-0 transition ease-in-out duration-200'} h-20 flex justify-center items-center p-4 rounded-md`}>
      <Flex className="justify-center items-center flex-grow">
        <p className="text-white text-center">{message}</p>
      </Flex>
      <span className="cursor-pointer ml-5" onClick={() => setModalOpen(false)}>
        <Image src={Close} alt="close" height={25} width={25}/>
      </span>
    </div>
  )
}

export default MessageModal
