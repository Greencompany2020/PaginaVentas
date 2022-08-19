
import Image from "next/image";
import {DashboardButton, DashboardButtonContainer } from "../components/buttons";
import SalesForecast from "../public/icons/sales-forecast.svg";
import Chat from "../public/icons/chat.svg";
import Config from "../public/icons/config-5.png";
import withAuth from "../components/withAuth";
import { getBaseLayout } from "../components/layout/BaseLayout";
import {useSelector} from 'react-redux'
import { v4 } from "uuid";

const Dashboard = () => {

  const {user, access, parameters} = useSelector(state => state);

  const FavoriteItem = () =>{
    if(access){
      const favoriteItem = access.filter(item => item.Selected === 'Y');
      const Items = favoriteItem.map( item => (
        <DashboardButton key={v4()} name={item.Nombre} link={item.Endpoint} />
      ));
      return Items;
    }
    return <></>
  }

  
  return(
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 p-2 md:p-4 xl:p-8">
          <section>
            <div className="mb-8">
              <h2 className="text-2xl font-bold">{`Bienvenido ${user?.Nombre || ''} ${user?.Apellidos || ''}`}</h2>
            </div>
            <div className="grid grid-cols-1 place-items-center md:grid-cols-[repeat(_2,_250px)] gap-6">
              <DashboardButtonContainer link={parameters?.point || '/ventas'}>
                <Image
                  src={SalesForecast}
                  alt="ventas"
                  className="w-28 h-28 m-auto"
                  height={128}
                  width={128}
                />
                <p>Estadísticas de Ventas</p>
              </DashboardButtonContainer>
              <DashboardButtonContainer link="/configuracion/usuarios">
                <Image
                  src={Config}
                  alt="ventas"
                  className="w-28 h-28 m-auto"
                  height={128}
                  width={128}
                />
                <p>Configuraciones</p>
              </DashboardButtonContainer>
              <DashboardButtonContainer link="/minutas">
                <Image
                  src={Chat}
                  alt="ventas"
                  className="w-28 h-28 m-auto"
                  height={128}
                  width={128}
                />
                <p>Minutas</p>
              </DashboardButtonContainer>
            </div>
          </section>

          <section>
            <p className="text-gray-500 font-bold text-xl text-center md:self-end lg:mr-14 md:mr-12">
              Dashboard
            </p>
            <div className="grid grid-col-1 sm:grid-cols-2 gap-y-8 md:gap-x-8 md:gap-14 lg:gap-8 text-gray-800 font-bold mt-3 h-[380px] overflow-y-auto">
              {FavoriteItem()}
            </div>
          </section>
      </div>
    </>
  )
};
const DashboardWithAuth = withAuth(Dashboard);
DashboardWithAuth.getLayout = getBaseLayout;
export default DashboardWithAuth
