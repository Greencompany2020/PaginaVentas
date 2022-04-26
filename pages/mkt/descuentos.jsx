import { getVentasLayout } from '../../components/layout/VentasLayout';
import withAuth from '../../components/withAuth';

const Descuentos = () => {
  return (
    <>
      <h1 className='text-4xl m-auto'>Procedimiento en Construcción</h1>
    </>
  )
}

const DescuentosWithAuth = withAuth(Descuentos);
DescuentosWithAuth.getLayout = getVentasLayout;
export default DescuentosWithAuth;
