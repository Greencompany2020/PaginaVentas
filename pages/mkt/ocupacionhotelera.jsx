import { getVentasLayout } from '../../components/layout/VentasLayout';
import withAuth from '../../components/withAuth';
const OcupacionHotelera = () => {
  return (
    <>
      <h1 className='text-4xl m-auto'>Procedimiento en Construcción</h1>
    </>
  )
}

const OcupacionHoteleraWithAuth = withAuth(OcupacionHotelera);
OcupacionHoteleraWithAuth.getLayout = getVentasLayout;
export default OcupacionHoteleraWithAuth;

