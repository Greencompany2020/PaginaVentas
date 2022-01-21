import Image from 'next/image'
import Navbar from 'components/Navbar';
import { DashboardButton, DashboardButtonContainer, } from '@components/buttons';
import { Flex } from '@components/containers';
import SalesForecast from '@public/icons/sales-forecast.svg';
import Chat from '@public/icons/chat.svg';

const Dashboard = () => {
  return (
    <div className='w-full h-screen bg-white overflow-x-hidden'>
      <Navbar />
      <section className='flex flex-col md:flex-row pt-16 w-screen'>
        <Flex className="flex-col items-center lg:w-2/5 m-auto">
          <div className='text-2xl font-bold lg:pl-14'>
            <h1>Bienvenido, <span className='text-xl'>Mauricion Rochin</span></h1>
          </div>
          <div className='text-center text-lg space-y-5 mt-5'>
            <DashboardButtonContainer link='/comparativo/grupo'>
              <Image src={SalesForecast} alt='ventas' className='w-32 h-32 m-auto' height={128} width={128} />
              <p>Estadísticas de Venta</p>
            </DashboardButtonContainer>
            <DashboardButtonContainer link='/minutas'>
              <Image src={Chat} alt='ventas' className='w-32 h-32 m-auto' height={128} width={128} />
              <p>Minutas</p>
            </DashboardButtonContainer>
          </div>
        </Flex>
        <Flex className='flex-col pt-12 md:pt-28 sm:w-4/5 md:w-3/5 lg:w-2/5 m-auto'>
          <p className='text-gray-500 font-bold text-xl text-center md:self-end lg:mr-14 md:mr-12'>Dashboard</p>
          <div className='grid grid-col-1 sm:grid-cols-2 gap-y-8 md:gap-x-8 md:gap-14 lg:gap-8 text-gray-800 font-bold mt-3'>
            <DashboardButton name='Semanales por plaza' link='/semanales/plazas' />
            <DashboardButton name='Semanales por tienda' link='/semanales/tiendas' />
            <DashboardButton name='Concentrado mensual' link='/mensuales/concentrado' />
            <DashboardButton name='Concentrado todas la tiendas' link='/comparativo/grupo' />
          </div>
        </Flex>
      </section>
    </div>
  )
}

export default Dashboard
