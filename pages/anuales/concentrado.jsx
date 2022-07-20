import { getVentasLayout } from "../../components/layout/VentasLayout";
import withAuth from "../../components/withAuth";
const Concentrado = () => {
  return (
    <div className="grid place-items-center h-full">
      <h1 className="text-4xl m-auto">Procedimiento en Construcción</h1>
    </div>
  );
};

const ConcentradoWithAuth = withAuth(Concentrado);
ConcentradoWithAuth.getLayout = getVentasLayout;
export default ConcentradoWithAuth;
