import { getVentasLayout } from "../../components/layout/VentasLayout";
import withAuth from "../../components/withAuth";

const Descuentos = () => {
  return (
    <div className="h-full grid place-items-center">
      <h1 className="text-4xl m-auto">Procedimiento en Construcción</h1>
    </div>
  );
};

const DescuentosWithAuth = withAuth(Descuentos);
DescuentosWithAuth.getLayout = getVentasLayout;
export default DescuentosWithAuth;
