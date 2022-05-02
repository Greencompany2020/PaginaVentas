import { getVentasLayout } from '../../components/layout/VentasLayout';
import withAuth from '../../components/withAuth';
const Comparativo = () => {
  return (
    <>
      <h1 className='text-4xl m-auto'>Procedimiento en Construcción</h1>
    </>
  )
}

const ComparativoWithAuth = withAuth(Comparativo);
ComparativoWithAuth.getLayout = getVentasLayout;
export default ComparativoWithAuth;