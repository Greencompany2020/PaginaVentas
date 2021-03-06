import Image from 'next/image'
import Navbar from '../components/Navbar';
import { DashboardButton, DashboardButtonContainer, } from '../components/buttons';
import { Flex } from '../components/containers';
import SalesForecast from '../public/icons/sales-forecast.svg';
import Chat from '../public/icons/chat.svg';
import Config from '../public/icons/config-5.png'
import withAuth from '../components/withAuth';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const customDashboards = [
  {
    id: 1,
    name: 'Semanales por plaza',
    link: '/semanales/plazas'
  },
  {
    id: 2,
    name: 'Semanales por plaza',
    link: '/semanales/tiendas'
  },
  {
    id: 3,
    name: 'Concentrado mensual',
    link: '/mensuales/concentrado'
  },
  {
    id: 4,
    name: 'Concentrado todas la tiendas',
    link: '/comparativo/grupo'
  },
  {
    id: 5,
    name: 'Anuales por plaza',
    link: '/anuales/plaza'
  },
  {
    id: 6,
    name: 'Rango de ventas por plaza',
    link: '/rangodeventas/plaza'
  },
];


const DashboardItems = ({data}) => {
  if(!data) return <></>
  const itemsEnabled = data.filter(item => item.Enabled === 'Y' );
  const Items = itemsEnabled.map((item, index) => <DashboardButton key={index} name={item.Nombre} link={item.Endpoint} />)
  return Items;
}

const Dashboard = () => {

  const auth = useAuth();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState(null);


  const getData = async () =>{
    const data = await auth.getUserData();
    setUser(data.user);
    setFavorites(data.dashboards);
  }


  useEffect(()=>{
   getData();
  },[]);

 
  return (
    <div className='w-full h-screen bg-white overflow-x-hidden relative'>
      <Navbar />
      <section className='flex flex-col md:flex-row pt-16 w-screen'>
        <Flex className="flex-col items-center lg:w-2/5 m-auto">
          <div className='text-2xl font-bold lg:pl-14'>
            <h1>Bienvenido, <span className='text-xl'>{user?.Nombre} {user?.Apellidos}</span></h1>
          </div>
          <div className='grid lg:grid-cols-2 gap-6 text-center text-lg mt-5'>
            <DashboardButtonContainer link='/ventas'>
              <Image src={SalesForecast} alt='ventas' className='w-32 h-32 m-auto' height={128} width={128} />
              <p>Estad??sticas de Venta</p>
            </DashboardButtonContainer>
            <DashboardButtonContainer link='/minutas'>
              <Image src={Config} alt='ventas' className='w-32 h-32 m-auto' height={128} width={128} />
              <p>Configuraciones</p>
            </DashboardButtonContainer>
            <DashboardButtonContainer link='/minutas'>
              <Image src={Chat} alt='ventas' className='w-32 h-32 m-auto' height={128} width={128} />
              <p>Minutas</p>
            </DashboardButtonContainer>
          </div>
        </Flex>
        <Flex className='flex-col pt-12 md:pt-28 sm:w-4/5 md:w-3/5 lg:w-2/5 m-auto'>
          <p className='text-gray-500 font-bold text-xl text-center md:self-end lg:mr-14 md:mr-12'>Dashboard</p>
          <div className='grid grid-col-1 sm:grid-cols-2 gap-y-8 md:gap-x-8 md:gap-14 lg:gap-8 text-gray-800 font-bold mt-3 h-[380px] overflow-y-scroll'>
            <DashboardItems data={favorites}/>
          </div>
        </Flex>
      </section>
    </div>
  )
}
export default withAuth(Dashboard);
