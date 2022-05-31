// Componentes externos
// Componentes propios
import Navbar from "../Navbar";
import SideMenu from "../SideMenu";
// Funciones y hooks
// Recursos (img, js, css)

const VentasLayout = ({ children }) => {
  return (
    <>
      <div className="h-screen w-full overflow-hidden">
        <Navbar />
        <SideMenu />
        <section className="flex flex-col h-full ">{children}</section>
      </div>
    </>
  );
};

export const getVentasLayout = (page) => <VentasLayout>{page}</VentasLayout>;

export default VentasLayout;
