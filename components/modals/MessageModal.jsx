import Image from 'next/image'
import React from 'react'
import { Flex } from '../containers'
import Close from '../../public/icons/close.svg';

const MessageModal = ({ modalOpen, setModalOpen, message }) => {
  return (
    <div className={`Message-modal active}`}>
      <span className="cursor-pointer ml-5" onClick={() => setModalOpen(false)}>
        <Image src={Close} alt="close" height={25} width={25}/>
      </span>
      <Flex className="justify-center items-center flex-grow">
        <p className="text-white text-center">{message}</p>
      </Flex>
    </div>
  )
}

export default MessageModal
