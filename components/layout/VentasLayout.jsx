import Navbar from "../Navbar";
import SideMenu from "../SideMenu";
import Toolbar from "../toolbar";

const VentasLayout = ({ children }) => {
  return (
    <div className="layout-ventas">
      <div className="layout-ventas-navbar">
        <Navbar />
      </div>
      <div className="layout-ventas-toolbar">
        <Toolbar>
          <SideMenu />
        </Toolbar>
      </div>
      <main className="layout-ventas-main">{children}</main>
    </div>
  );
};

export const getVentasLayout = (page) => <VentasLayout>{page}</VentasLayout>;
export default VentasLayout;
