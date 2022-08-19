import Image from "next/image";
// Componentes propios
import { Flex } from "../containers";
// Funciones y hooks
// Recursos (img, js, css)
import Trend from "../../public/images/trend.png";

const ComparativoVentas = ({ children }) => {
  return <div className="overflow-y-auto w-[700px] md:w-full h-full md:p-8 xl:p-16 2xl:p-24">{children}</div>;
};

export default ComparativoVentas;
