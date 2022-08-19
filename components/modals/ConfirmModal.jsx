import React, { useImperativeHandle, useState } from 'react'
import { XIcon} from '@heroicons/react/outline';
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
    <>
      <div className={`confirm-modal ${showDialog && 'active' }`} >
        <div className="confirm-modal-header">
          <span className='text-white font-semibold'>{props.title || 'Confirmar'}</span>
          <XIcon width={28} className='cursor-pointer text-white'  onClick={() => setShowDialog(false)}/>
        </div>
        <p className='mt-4 p-2 text-lg text-center'>{props.message || '¿Seguro que desea continuar?'}</p>
        <div className=' fixed bottom-0 w-full flex justify-end p-2'>
            <button 
              className="secondary-btn w-28 mr-2"
              onClick={() => handleResolve(false)}
            >
              Cancelar
            </button>
            <button 
              className="primary-btn w-28"
              onClick={() => handleResolve(true)}
            >
              Continuar
            </button>
        </div>
      </div>

      <div className={`${!showDialog && 'hidden'}  fixed top-0 right-0 w-screen min-h-screen bg-gray-500 z-10 opacity-80`}/>
    </>
   
  )
})

ConfirmModal.displayName = "ConfirmModal"

export default ConfirmModal
