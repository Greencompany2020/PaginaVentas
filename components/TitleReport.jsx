import Image from 'next/image';
import Trend from '../public/images/trend.png'

export default function TitleReport(props){
    const {title, description} = props;
    return(
        <section className='w-full h-18 pl-16 pt-1 border-b-2 space-x-1 space-y-1'>
            <div className='flex flex-row items-center space-x-3'>
                <div>
                    <Image src={Trend} alt='' className='w-8 h-8 text-black' height={32} width={32}/>
                </div>  
                <h1 className='text-2xl font-semibold'>{title}</h1>
            </div>
            <p className='text-gray-400 text-md p-2'>{description}</p>
        </section>
    )
}