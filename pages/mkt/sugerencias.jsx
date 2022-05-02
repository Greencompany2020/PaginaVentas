import { getVentasLayout } from '../../components/layout/VentasLayout';
import withAuth from '../../components/withAuth';


const Sugerencia = () => {
  return (
    <>
      <h1 className='text-4xl m-auto'>Procedimiento en Construcción</h1>
    </>
  )
}

const SugerenciaWithAuth = withAuth(Sugerencia);
SugerenciaWithAuth.getLayout = getVentasLayout;
export default SugerenciaWithAuth;
