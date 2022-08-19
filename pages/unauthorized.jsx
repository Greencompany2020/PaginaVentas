import Image from 'next/image'
import unauthorizeImage from '../public/images/unauthorized.jpg' 
import witAuth from '../components/withAuth';
import { getVentasLayout } from '../components/layout/VentasLayout';

const  Unauthorized = () => {
    return(
        <div className="w-full h-full grid place-items-center  overflow-hidden">
            <Image src={ unauthorizeImage} className=" object-contain"/>
        </div>
    )
}

const UnauthorizedWithAuth = witAuth(Unauthorized);
UnauthorizedWithAuth.getLayout = getVentasLayout
export default UnauthorizedWithAuth

