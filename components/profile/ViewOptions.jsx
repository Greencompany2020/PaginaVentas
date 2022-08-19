import React,{useState} from 'react';
import Image from 'next/image';
import tableIcon from '../../public/icons/table.svg';
import statIcon from '../../public/icons/stat.svg';
import statGroupIcon from '../../public/icons/stat-group.svg';
import mobileTableIcon from '../../public/icons/mobile-table.svg';
import desktop from '../../public/icons/desktop.svg';
import mobile from '../../public/icons/mobile.svg';

export default function ViewOptions(props) {
    const {handleChangeView, mobileOption, desktopOption} = props;
    const [deviceSelect, setDeviceSelect] = useState(1);

    const handleChange = viewOption => {
        const device = deviceSelect == 1 ? 'desktop' : 'mobile';
        handleChangeView(viewOption , device);
    }
    const isSaved = viewOption => {
        if(deviceSelect == 1) return viewOption == desktopOption;
        return viewOption == mobileOption;
    }

    return (
        <section className='flex flex-row w-full'>
            <div className='flex flex-col w-20'>
                <button 
                    className={`flex-1 rounded-l-md hover:bg-gray-200 ${deviceSelect == 1 ? 'bg-gray-200' : 'bg-gray-100'}`}
                    onClick={() => setDeviceSelect(1)}
                    type='button'
                >
                    <figure>
                        <Image src={desktop} width={28} alt={'icon'}/>
                    </figure>
                </button>
                <button 
                    className={`flex-1 rounded-l-md hover:bg-gray-200 ${deviceSelect == 2 ? 'bg-gray-200' : 'bg-gray-100' }`}
                    onClick={() => setDeviceSelect(2)}
                    type='button'
                >
                    <figure>
                        <Image src={mobile} width={28} alt={'icon'}/>
                    </figure>
                </button>
            </div>

            
            <div className='space-y-2 p-2 bg-gray-200 rounded-r-md flex flex-col items-center w-full'>
                <button 
                    className={` flex items-center justify-start space-x-2 rounded-md h-8 w-40 hover:bg-blue-400 ${isSaved(1) ? 'bg-blue-400' : 'bg-slate-300'}`}  
                    type='button'
                    onClick={() => handleChange(1)}
                >
                    <figure>
                        <Image src={tableIcon} width={24} alt={'icon'}/>
                    </figure>
                    <span>Vista de tabla</span>
                </button>

                <button 
                     className={` flex items-center justify-start space-x-2 rounded-md h-8 w-40 hover:bg-blue-400 ${isSaved(2) ? 'bg-blue-400' : 'bg-slate-300'}`} 
                    type='button'
                    onClick={() => handleChange(2)}
                >
                    <figure>
                        <Image src={statIcon} width={24} alt={'icon'}/>
                    </figure>
                    <span>Vista por tarjetas</span>
                </button>
                
                <button 
                    className={` flex items-center justify-start space-x-2 rounded-md h-8 w-40 hover:bg-blue-400 ${isSaved(3) ? 'bg-blue-400' : 'bg-slate-300'}`} 
                    type='button'
                    onClick={() => handleChange(3)}
                >
                    <figure>
                        <Image src={statGroupIcon} width={24} alt={'icon'}/>
                    </figure>
                    <span>Vista de region</span>
                </button>

                <button 
                    className={` flex items-center justify-start space-x-2 rounded-md h-8 w-40 hover:bg-blue-400 ${isSaved(4) ? 'bg-blue-400' : 'bg-slate-300'}`} 
                    type='button'
                    onClick={() => handleChange(4)}
                >
                    <figure>
                        <Image src={mobileTableIcon} width={24} alt={'icon'}/>
                    </figure>
                    <span>Vista por seccion</span>
                </button>
            </div>
        </section>
    )
}
