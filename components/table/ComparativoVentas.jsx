import Image from "next/image";
// Componentes propios
import { Flex } from "../containers";
// Funciones y hooks
// Recursos (img, js, css)
import Trend from "../../public/images/trend.png";

const ComparativoVentas = ({ children }) => {
  return <div className="overflow-y-auto">{children}</div>;
};

export default ComparativoVentas;
