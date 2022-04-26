import  { getVentasLayout } from "../components/layout/VentasLayout";
import witAuth from "../components/withAuth"

const ventas = () => {
    return(
        <></>
    )
}

const ventasWithAuth = witAuth(ventas);
ventasWithAuth.getLayout = getVentasLayout;
export default ventasWithAuth;