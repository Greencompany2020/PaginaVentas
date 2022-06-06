import { getVentasLayout } from "../../components/layout/VentasLayout";
import withAuth from "../../components/withAuth";
const GraficaPromociones = () => {
  return (
    <div className="h-full grid place-items-center">
      <h1 className="text-4xl m-auto">Procedimiento en Construcción</h1>
    </div>
  );
};

const GraficaPromocionesWithAuth = withAuth(GraficaPromociones);
GraficaPromocionesWithAuth.getLayout = getVentasLayout;
export default GraficaPromocionesWithAuth;
