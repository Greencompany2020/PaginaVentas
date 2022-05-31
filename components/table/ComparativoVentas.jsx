import Image from "next/image";
// Componentes propios
import { Flex } from "../containers";
// Funciones y hooks
// Recursos (img, js, css)
import Trend from "../../public/images/trend.png";

const ComparativoVentas = ({ children }) => {
  return (
    <section className="h-full overflow-hidden">
      <div className="h-[70%]  overflow-y-auto rounded-xl">{children}</div>
    </section>
  );
};

export default ComparativoVentas;
