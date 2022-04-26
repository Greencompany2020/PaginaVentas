import { getVentasLayout } from '../../components/layout/VentasLayout';
import withAuth from '../../components/withAuth';
const GraficaPromociones = () => {
  return (
    <>
      <h1 className='text-4xl m-auto'>Procedimiento en Construcción</h1>
    </>
  )
}

const GraficaPromocionesWithAuth = withAuth(GraficaPromociones);
GraficaPromocionesWithAuth.getLayout = getVentasLayout;
export default GraficaPromocionesWithAuth;
