import { useState } from 'react';
import Image from 'next/image';
import Navbar from "@components/Navbar"
import { MinutasButton } from '@components/buttons'
import { Flex } from '@components/containers'
import Chat from '@public/icons/chat.svg'
import Refresh from '@public/icons/refresh.svg'
import Home from '@public/icons/home.svg'
import Folder from '@public/images/folder-icon.png'
import Question from '@public/images/question.png'
import Trash from '@public/images/trash-icon.png'
import Menu from '@public/icons/dot-menu.svg'

import { minutas } from 'utils/data';

const Minutas = () => {
  const [showModal, setShowModal] = useState(false)

  const handleModal = () => {
    setShowModal(!showModal);
  }

  return (
    <>
      <Navbar />
      <Flex className="w-full h-full justify-center items-center py-10 relative">
        <Flex className="bg-gray-100 p-1 w-full lg:w-3/5 h-full rounded-lg flex-col">
          <Flex className="justify-between p-4">
            <h1 className="font-bold text-2xl">Minutas GreenCompany</h1>
            <Image src={Chat} alt='' className="w-9 h-9" height={36} width={36}/>
          </Flex>
          <div className="h-5/6 w-full bg-white p-2">
            <Flex className="justify-center sm:justify-end mb-2 flex-wrap">
              <MinutasButton>
                <Image src={Home} alt='' height={28} width={28} />
                <span className="text-white ml-2">Raíz</span>
              </MinutasButton>
              <MinutasButton onClick={handleModal}>
                <Image src={Chat} alt='' height={28} width={28}/>
                <span className="text-white mr-2">+ Carpeta</span>
              </MinutasButton>
              <MinutasButton>
                <Image src={Chat} alt='' height={28} width={28} />
                <span className="text-white mr-2">+ Minuta</span>
              </MinutasButton>
              <MinutasButton>
                <Image src={Refresh} alt='' height={28} width={28} />
                <span className="text-white mr-2">Actualizar</span>
              </MinutasButton>
              <MinutasButton>
                <Image src={Menu} alt='' height={28} width={28} />
                <span className="text-white mr-2">Actualizar</span>
              </MinutasButton>
            </Flex>
            <div className="bg-gray-100 w-full p-1 rounded-sm">
              <p><span className="font-bold">Directorio actual:</span> Minutas /</p>
            </div>
            <table className="bg-gray-100 mt-2 w-full border-2 table-auto">
              <thead>
                <tr className="text-gray-500 font-bold text-lg">
                  <th colSpan={2}>Minuta/Carpeta</th>
                  <th>Tamaño</th>
                  <th>---</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='w-10 p-2 border-2 text-yellow-500'>
                    <Image src={Folder} alt='' className="w-7 h-7 m-auto object-cover" />
                  </td>
                  <td className='border-2 text-left pl-1'>
                    ...
                  </td>
                  <td className='border-2'></td>
                  <td className='border-2'></td>
                  <td className='border-2'></td>
                </tr>
                {
                  minutas.map(item => (
                    <tr className="text-center" key={item.id}>
                      <td className="w-10 p-2 border-2 text-yellow-500">
                        {item.file ? <Image src={Question} alt='' className="m-auto object-contain" height={28} width={28} /> : <Image src={Folder} alt='' className="m-auto object-contain" height={28} width={28}/>}
                      </td>
                      <td className="border-2 text-left pl-1">
                        {item.nombre}
                      </td>
                      <td className="border-2">
                        {item.tamaño}
                      </td>
                      <td className="border-2">
                        ---
                      </td>
                      <td className="border-2 text-blue-600">
                        <Image src={Trash} alt='' className="m-auto object-contain" height={28} width={28} />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
          <Flex>
            <p><span className="font-bold">Carpetas: </span>11</p>
            <p className="ml-1"><span className="font-bold">Archivos: </span>1</p>
          </Flex>
        </Flex>
        <div className={`bg-black bg-opacity-80 absolute w-4/5 sm:w-2/3 lg:w-1/3 ${showModal ? 'top-1/4 transform scale-100 transition ease-in-out duration-200' : '-top-1/4 transform scale-0 transition ease-out duration-200'} h-20 flex justify-center items-center p-4 rounded-md`}>
          <form className="w-full flex justify-evenly items-center">
            <Flex className="flex-col flex-grow mr-2">
              <label htmlFor="carpeta" className="text-white">Nueva Carpeta</label>
              <input type="text" name="carpeta" className="rounded-md outline-none h-8" />
            </Flex>
            <button className="w-28 self-end text-white rounded-lg bg-sky-500 hover:bg-sky-400 h-8 transition-all ease-in-out duration-200">
              Crear
            </button>
          </form>
        </div>
      </Flex>
    </>
  )
}

export default Minutas
