import withAuth from "../components/withAuth";
import { getBaseLayout } from "../components/layout/BaseLayout";
import {useSelector} from 'react-redux'
import DirectAccess from "../components/DirectAccess";
import { v4 } from "uuid";

const Dashboard = () => {

  const {user, access, parameters} = useSelector(state => state);

  const FavoriteItem = () =>{
    if(access){
      const favoriteItem = access.filter(item => item.Selected === 'Y');
      const Items = favoriteItem.map( item => (
        <DirectAccess key={v4()} name={item.Nombre} link={item.Endpoint} image={'/images/dashboard-icon.png'} />
      ));
      return Items;
    }
    return <></>
  }

  
  return(
   <>
      <div className="p-8">
        <section className="">
          <h2 className="text-xl md:text-3xl">
            Bienvenido, <span className="font-semibold">{`${user.Nombre} ${user.Apellidos}`}</span>
          </h2>
        </section>

        <section className="flex flex-col md:flex-row ">

          <div className="flex-1 mt-4 md:mt-0">
            <div className="mb-4">
              <p className="text-right font-bold">Menu</p>
              <hr />
            </div>
            <section className="grid grid-cols-2 xl:grid-cols-4 content-center gap-8">
              <DirectAccess link={parameters?.point || '/ventas'} name={'Estadisticas de ventas'} image={'/icons/sales-forecast.svg'} />
              <DirectAccess link={'/minutas'} name={'Minutas'} image={'/icons/chat.svg'} />
              <DirectAccess link={'/configuracion/usuarios'} name={'Configuracion'} image={'/icons/config-5.png'} />
              
            </section>
          </div>

          <div className="flex-1 mt-8 md:mt-0 md:ml-12">
            <div className="mb-4">
              <p className="text-right font-bold">Dashboards</p>
              <hr />
            </div>
            <section className="grid grid-cols-2 xl:grid-cols-4  content-center gap-8">
              <FavoriteItem />
            </section>
          </div>

        </section>
      </div>
   </>
  )
};
const DashboardWithAuth = withAuth(Dashboard);
DashboardWithAuth.getLayout = getBaseLayout;
export default DashboardWithAuth
