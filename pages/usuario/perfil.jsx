import Image from 'next/image';
import { Flex } from '../../components/containers';
import { getBaseLayout } from '../../components/layout/BaseLayout';
import { ChevronDownIcon } from '@heroicons/react/solid';
import Frogs from '../../public/images/rana10.png';
import Verify from '../../public/icons/ok-08.png';

const Perfil = () => {
  return (
    <>
      <div className='flex min-h-screen'>
      {/* Sección Editar Perfil */}
        <aside className='w-[350px] lg:flex-none bg-gray-200 p-8'>
          <Flex className='flex-col'>
            <p className='font-bold text-3xl mb-5'>Editar perfil</p>
            {/* Input Imagen Perfil */}
            <div className='w-full'>
              <label className='flex justify-center w-full h-48 px-4 transition bg-white border-2 border-gray-700 border-dashed appearance-none focus:outline-none'>
                <span className='flex flex-col items-center justify-center space-x-2'>
                  <div className='bg-gray-200 rounded-full p-2'>
                    <Image src={Frogs} height={100} width={100} alt='Señor Frogs' />
                  </div>
                  <span className='text-gray-400'>
                    Arrastra aquí tu imagen de perfil o <span className='text-blue-600 underline'>sube una foto</span>
                  </span>
                </span>
                <input type='file' className='hidden' />
              </label>
            </div>
            {/* Email y Contraseña */}
            <p className='font-bold text-2xl my-5'>Inicio de sesión</p>
            <Flex className='flex-col'>
              <label htmlFor="email" className='font-medium text-lg mb-2'>Email y Contraseña</label>
              <Flex className='relative'>
                <span className='absolute right-0 inset-y-1'>
                  <Image src={Verify} height={30} width={30} alt='OK' />
                </span>
                <input
                  disabled
                  type="text"
                  placeholder="Mauricio.rochin@greencompany.biz"
                  className="outline-none flex-grow h-10 rounded-md pl-1 bg-white placeholder:text-sm"
                />
              </Flex>
              <p className='text-blue-500 text-lg font-semibold mt-5 cursor-pointer hover:text-blue-400 transition duration-200'>
                Cambiar contraseña
              </p>
            </Flex>
          </Flex>
        </aside>
        {/* Sección Información */}
        <section className='flex flex-1 flex-col overflow-hidden pt-4 px-10'>
          <p className='text-3xl font-bold text-right'>Mauricio Rochin</p>
          <p className='text-3xl font-bold'>Información General</p>
          
          <Flex className='flex-col justify-center'>
            <Flex className='space-x-5 flex-grow justify-evenly'>
              {/* Empleado */}
              <Flex className='flex-col w-[190px]'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Empleado</label>
                <Flex className='relative border-2 rounded-lg'>
                  <span className='absolute right-0 inset-y-1'>
                    <Image src={Verify} height={30} width={30} alt='OK' />
                  </span>
                  <input
                    disabled
                    type="number"
                    placeholder="3725"
                    className="outline-none flex-grow h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:text-center placeholder:font-semibold"
                  />
                </Flex>
              </Flex>
              {/* Nombre */}
              <Flex className='flex-col w-2/5'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Nombre</label>
                <div className='relative w-full border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="Mauricio Rochin Angulo"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold"
                  />
                </div>
              </Flex>
              {/* User Level */}
              <Flex className='flex-col'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>User Level</label>
                <div className='relative w-[180px] border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="10"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold placeholder:text-center"
                  />
                </div>
              </Flex>
              {/* Clase */}
              <Flex className='flex-col'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Clase</label>
                <div className='relative w-[180px] border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="1"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold placeholder:text-center"
                  />
                </div>
              </Flex>
            </Flex>
            {/* F. Ingreso */}
            <Flex className='space-x-5 flex-grow justify-evenly'>
              <Flex className='flex-col w-[190px]'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>F. Ingreso</label>
                <div className='relative border-2 rounded-lg'>
                  <input
                    disabled
                    type="date"
                    value="2008-08-04"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white text-gray-400 font-semibold text-center"
                  />
                </div>
              </Flex>
              {/* Usuario */}
              <Flex className='flex-col w-2/5'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Usuario</label>
                <div className='relative w-full border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="Mauricio.rochin"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold"
                  />
                </div>
              </Flex>
              {/* Grupo */}
              <Flex className='flex-col w-[440px]'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Grupo</label>
                <div className='relative w-full border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="Administrador"
                    className="outline-none h-10 w-[200px] rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold"
                  />
                </div>
              </Flex>
            </Flex>
          </Flex>

          <Flex className='w-full justify-between items-center mt-5'>
            <p className='font-bold text-3xl'>Definición de Dashboard</p>
            <p className='text-right text-xl'>Página de Ventas</p>
          </Flex>
          
          <section className='w-full px-5'>
            <div className='w-full pt-3'>
              <Flex className='justify-between cursor-pointer'>
                <p className='font-semibold text-lg'>Diarias</p>
                <ChevronDownIcon className='h-7 w-7 text-gray-400' />
              </Flex>
              <div className='border-t-2'>
                
              </div>
            </div>
          </section>

          {/* <div className='grid grid-rows-2 grid-cols-4'>
              
              <Flex className='flex-col justify-self-center'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Empleado</label>
                <Flex className='relative w-[200px] border-2 rounded-lg'>
                  <span className='absolute right-0 inset-y-1'>
                    <Image src={Verify} height={30} width={30} alt='OK' />
                  </span>
                  <input
                    disabled
                    type="number"
                    placeholder="3725"
                    className="outline-none flex-grow h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:text-center placeholder:font-semibold"
                  />
                </Flex>
              </Flex>
              
              <Flex className='flex-col'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Nombre</label>
                <div className='relative w-full border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="Mauricio Rochin Angulo"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold"
                  />
                </div>
              </Flex>
              
              <Flex className='flex-col justify-self-center'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>User Level</label>
                <div className='relative w-[180px] border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="10"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold placeholder:text-center"
                  />
                </div>
              </Flex>
              
              <Flex className='flex-col justify-self-start'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Clase</label>
                <div className='relative w-[180px] border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="1"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold placeholder:text-center"
                  />
                </div>
              </Flex>
              
              <Flex className='flex-col justify-self-center'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Clase</label>
                <div className='relative w-[200px] border-2 rounded-lg'>
                  <input
                    disabled
                    type="date"
                    value="2008-08-04"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white text-gray-400 font-semibold text-center"
                  />
                </div>
              </Flex>
              
              <Flex className='flex-col'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Usuario</label>
                <div className='relative w-full border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="Mauricio.rochin"
                    className="outline-none w-full h-10 rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold"
                  />
                </div>
              </Flex>
              
              <Flex className='flex-col col-span-2 px-20'>
                <label htmlFor="email" className='font-medium text-lg mb-2'>Usuario</label>
                <div className='relative w-full border-2 rounded-lg'>
                  <input
                    disabled
                    type="text"
                    placeholder="Administrador"
                    className="outline-none h-10 w-[200px] rounded-md pl-1 bg-white placeholder:text-lg placeholder:font-semibold"
                  />
                </div>
              </Flex>
          </div> */}

        </section>
      </div>
    </>
  )
}

Perfil.getLayout = getBaseLayout;

export default Perfil
