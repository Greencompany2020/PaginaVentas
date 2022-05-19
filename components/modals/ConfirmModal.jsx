import React, { useImperativeHandle, useState } from 'react'
import { XCircleIcon} from '@heroicons/react/outline';
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
    <div className={`Form-modal ${showDialog && 'active' }`} >
      <div className="flex flex-row flex-nowrap justify-end p-2 border-b items-center">
        <XCircleIcon className='w-[32px] cursor-pointer text-white'  onClick={() => setShowDialog(false)}/>
      </div>

      <div>
        <div className='bg-slate-50 min-w-[400px] min-h-[100px] pt-10'>
        <p className="text-center text-xl">¿Seguro que desea continuar?</p>
        </div>
      </div>
      <div className='flex w-full justify-end bg-slate-50 p-2'>
        <button className="secondary-btn w-28 mr-2"
            onClick={() => handleResolve(false)}>
            Cancelar
          </button>
          <button className="primary-btn w-28"
            onClick={() => handleResolve(true)}>
            Continuar
        </button>
      </div>
    </div>
  )
})

ConfirmModal.displayName = "ConfirmModal"

export default ConfirmModal
