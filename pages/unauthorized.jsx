import witAuth from '../components/withAuth';
import { getVentasLayout } from '../components/layout/VentasLayout';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Unauthorized = () => {
    return (
        <div class="h-full w-full flex flex-col justify-center items-center bg-gray-100">

            <div className='relative'>
                <h1 className="text-9xl font-extrabold text-gray-600 tracking-widest">403</h1>
                <div className="bg-blue-400 text-gray-100 px-2 text-sm rounded rotate-12 absolute top-16 right-16">
                    Pagina no autorizada
                </div>
            </div>


            <div className='text-xl text-gray-500 mt-4 p-2'>
                <p className='text-center md:text-justify indent-8 '> No cuentas con los permisos necesarios para accesar a la pagina</p>
                <p className='text-center mt-2'>Contacta a su administrador de TI</p>
            </div>
            <Link href="/dashboard">
                <a className="grid place-items-center mt-5 border-2 bg-black-light text-white w-32 h-12  rounded-md hover:bg-blue-400 shadow-md">
                    <span className='text-center'>Regresar</span>
                </a>
            </Link>
        </div>
    )
}

const UnauthorizedWithAuth = witAuth(Unauthorized);
UnauthorizedWithAuth.getLayout = getVentasLayout
export default UnauthorizedWithAuth

