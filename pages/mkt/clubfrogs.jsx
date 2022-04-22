import { getVentasLayout } from '../../components/layout/VentasLayout';
import withAuth from '../../components/withAuth';

const ClubFrogs = () => {
  return (
    <>
      <h1 className='text-4xl m-auto'>Procedimiento en Construcción</h1>
    </>
  )
}

const ClubFrogsWithAuth = withAuth(ClubFrogs);
ClubFrogsWithAuth.getLayout = getVentasLayout;
export default ClubFrogsWithAuth;
