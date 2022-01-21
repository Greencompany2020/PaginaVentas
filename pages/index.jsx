import Head from 'next/head';
import Image from 'next/image';
import Logo from '@public/images/green-company.png';
import { Flex } from '@components/containers';
import Link from 'next/link';

export const Home = () => {
  return (
    <>
      <Head>
        <title>Ventas</title>
      </Head>
      <Flex className="w-full h-screen bg-cyan-600 justify-center items-center">
        <div className="bg-gray-200 w-4/5 md:h-3/5 md:w-2/4 lg:h-4/5 xl:w-1/4 xl:h-3/5 rounded-xl">
          <div className="w-2/3 m-auto mt-10 mb-1">
            <Image src={Logo} alt="Green Company" className="m-auto h-40" />
          </div>
          <form action="" className="flex flex-col justify-start items-center">
            <Flex className="h-auto w-2/3 m-auto flex-col">
              <input type="text" name="username" placeholder="Usuario" className="h-14 mb-3 rounded-md p-3 outline-none" />
              <input type="password" name="passwod" placeholder="Contraseña" className="h-14 mb-3 rounded-md p-3 outline-none" />
              <Flex className="items-center justify-end mt-2 mb-2">
                <label htmlFor="recordar-contra" className="text-md">Recordar contraseña</label>
                <input type="checkbox" name="recordar-contra" className="ml-2 w-6 h-6" defaultChecked />
              </Flex>
              <input type="submit" className="h-12 rounded-md bg-sky-500 mt-4 sm:mt-10 md:mt-16 lg:mt-12 text-center text-gray-200 hover:cursor-pointer hover:bg-sky-400 transition ease-in-out duration-200" defaultValue="Iniciar sesión" />
              <Flex className="justify-end mt-3">
                <Link href="/"><a className="text-blue-600">¿Olvidaste la contraseña?</a></Link>
              </Flex>
            </Flex>
          </form>
        </div>
      </Flex>
    </>
  )
}

export default Home;
