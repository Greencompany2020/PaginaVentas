import Image from 'next/image';
import {  Flex } from '../../components/containers';
import { getBaseLayout } from '../../components/layout/BaseLayout';
import Frogs from '../../public/images/rana10.png';
import Verify from '../../public/icons/ok-08.png';
import { DashboardList } from '../../components/profile';
import withAuth from '../../components/withAuth';

const Perfil = () => {
  return (
    <>
      <div className='flex flex-col h-screen md:flex-row'>
      {/* Sección Editar Perfil */}
        <aside className='h-[32rem] bg-gray-200 p-8 md:h-full'>

        <Flex className='flex-col'>
            <p className='font-semibold text-xl mb-5'>Editar perfil</p>
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
            <p className='font-semibold  text-md  my-5'>Inicio de sesión</p>
            <Flex className='flex-col'>
              <label htmlFor="email" className='font-semibold text-md mb-2'>Email</label>
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
              <p className='text-blue-500 text-md font-semibold mt-5 cursor-pointer hover:text-blue-400 transition duration-200'>
                Cambiar contraseña
              </p>
            </Flex>
          </Flex>

        </aside>

       
        <section className='flex flex-col md:flex-[2] p-8 space-y-10'>
          <div>
            <div className='flex flex-col mb-4'>
              <span className='text-right text-2xl font-bold'>Mauricio Rochin</span>
              <span className='text-xl font-semibold'>Infomación General</span>
            </div>

            <div className='grid gap-4 md:grid-cols-6'>

              <div className='flex flex-col space-y-2 relative'>
                <label htmlFor="" className='text-md font-bold text-gray-600'>Empleado</label>
                <figure className='relative'>
                  <input 
                    type="text"  
                    className='outline-none border-2 h-10 rounded-md pl-1 placeholder:text-md placeholder:text-center placeholder:font-semibold w-[150px] md:w-full'
                    disabled
                  />
                  <span className=' absolute top-1 right-0'>
                    <Image src={Verify} height={30} width={30} alt='OK'/>
                  </span>
                </figure>
              
              </div>

              <div className='flex flex-col space-y-2 md:col-span-3'>
                <label htmlFor=""  className='text-md font-bold text-gray-600'>Nombre</label>
                <input 
                  type="text"  
                  className='outline-none border-2 h-10 rounded-md pl-1 placeholder:text-md placeholder:text-center placeholder:font-semibold'
                  disabled
                />
              </div>

              <div className='flex flex-col space-y-2'>
                <label htmlFor=""  className='text-md font-bold text-gray-600'>User Level</label>
                <input 
                  type="text"  
                  className='outline-none border-2 h-10 rounded-md pl-1 placeholder:text-md placeholder:text-center placeholder:font-semibold'
                  disabled
                />
              </div>

              <div className='flex flex-col space-y-2'>
                <label htmlFor=""  className='text-md font-bold text-gray-600'>Clase</label>
                <input 
                  type="text"  
                  className='outline-none border-2 h-10 rounded-md pl-1 placeholder:text-md placeholder:text-center placeholder:font-semibold'
                  disabled
                />
              </div>

              <div className='flex flex-col space-y-2'>
                <label htmlFor=""  className='text-md font-bold text-gray-600'>F.ingreso</label>
                <input 
                  type="text"  
                  className='outline-none border-2 h-10 rounded-md pl-1 placeholder:text-md placeholder:text-center placeholder:font-semibold w-[150px] md:w-full'
                  disabled
                />
              </div>

              <div className='flex flex-col space-y-2 md:col-span-3'>
                <label htmlFor=""  className='text-md font-bold text-gray-600'>Usuario</label>
                <input 
                  type="text"  
                  className='outline-none border-2 h-10 rounded-md pl-1 placeholder:text-md placeholder:text-center placeholder:font-semibold'
                  disabled
                />
              </div>

              <div className='flex flex-col space-y-2 md:col-span-2'>
                <label htmlFor=""  className='text-md font-bold text-gray-600'>Grupo</label>
                <input 
                  type="text"  
                  className='outline-none border-2 h-10 rounded-md pl-1 placeholder:text-md placeholder:text-center placeholder:font-semibold'
                  disabled
                />
              </div>
            </div>
          </div>

          <div>
            <div className='flex flex-col md:flex-row  md:justify-between'>
              <span className='text-xl font-semibold mb-3 md:mb-0'>Definicón de Dashboard</span>
              <span className=' font-semibold'>Página de ventas</span>
            </div>
            <DashboardList/>
          </div>
        </section>

          {/*<section className='w-full px-5'>
            <div className='w-full pt-3'>
              <Flex className='justify-between cursor-pointer'>
                <p className='font-semibold text-lg'>Diarias</p>
                <ChevronDownIcon className='h-7 w-7 text-gray-400' />
              </Flex>
              <div className='border-t-2'>
                
              </div>
            </div>
          </section>*/}

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
      </div>
    </>
  )
}

const PerfilWithAuth = withAuth(Perfil);
PerfilWithAuth.getLayout = getBaseLayout;
export default PerfilWithAuth;
