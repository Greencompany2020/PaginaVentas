import { getVentasLayout } from '../../components/layout/VentasLayout';
import withAuth from '../../components/withAuth';
const Concentrado = () => {
  return (
    <>
      <h1 className='text-4xl m-auto'>Procedimiento en Construcción</h1>
    </>
  )
}

const ConcentradoWithAuth = withAuth(Concentrado);
ConcentradoWithAuth.getLayout = getVentasLayout();
export default ConcentradoWithAuth;
