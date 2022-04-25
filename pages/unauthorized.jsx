import Image from 'next/image'
import unauthorizeImage from '../public/images/unauthorized.jpg' 
export default function Unauthorized(){
    return(
        <div className="h-screen grid place-items-center">
            <Image src={ unauthorizeImage} className=" object-contain"/>
            <div className=" absolute bottom-0 bg-red-500 w-full h-20 grid place-items-center">
                <p className=' text-white text-2xl'>No esta autorizado</p>
            </div>
        </div>
    )
}

