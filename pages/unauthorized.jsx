import Image from 'next/image'
import unauthorizeImage from '../public/images/unauthorized.jpg' 
import { getVentasLayout } from '../components/layout/VentasLayout';

export default function Unauthorized(){
    return(
        <div className="w-full grid place-items-center  overflow-hidden">
            <Image src={ unauthorizeImage} className=" object-contain"/>
        </div>
    )
}

Unauthorized.getLayout = getVentasLayout;

