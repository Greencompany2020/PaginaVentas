import React, { useImperativeHandle, useState } from 'react'
import Image from 'next/image'
import { Flex } from '../containers'
import Close from '../../public/icons/close.svg';

const ConfirmModal = React.forwardRef((props, ref) => {
  const [showDialog, setShowDialog] = useState(false);
  const [promiseInfo, setPromiseInfo] = useState({
    onResolve: null,
    onReject: null
  });

  useImperativeHandle(ref, () => ({
    show: () => {
      return new Promise((onResolve, onReject) => {
        setPromiseInfo({
          onResolve,
          onReject
        });
        setShowDialog(true)
      })
    }
  }))

  const handleResolve = (value) => {
    setShowDialog(false);
    promiseInfo.onResolve(value)
  }

  return (
    <div className={`bg-black border-2 border-gray-100 absolute w-4/5 sm:w-2/3 lg:w-1/3 ${showDialog ? 'top-1/4 transform scale-100 transition ease-in-out duration-200' : '-top-1/4 transform scale-0 transition ease-in-out duration-200'} h-20 flex justify-center items-center p-4 rounded-md`}>
      <Flex className="justify-center items-center flex-col flex-grow">
        <p className="text-white text-center">¿Seguro que desea continuar?</p>
        <Flex>
          <button className="bg-red-500 w-40 rounded-lg h-10 flex justify-center items-center ml-2 mt-1 hover:bg-red-400 transition-all ease-in-out duration-200"
            onClick={() => handleResolve(false)}>
            Cancelar
          </button>
          <button className="bg-green-500 w-40 rounded-lg h-10 flex justify-center items-center ml-2 mt-1 hover:bg-green-400 transition-all ease-in-out duration-200"
            onClick={() => handleResolve(true)}>
            Continuar
          </button>
        </Flex>
      </Flex>
      <span className="cursor-pointer ml-5" onClick={() => setShowDialog(false)}>
        <Image src={Close} alt="close" height={25} width={25}/>
      </span>
    </div>
  )
})

ConfirmModal.displayName = "ConfirmModal"

export default ConfirmModal
