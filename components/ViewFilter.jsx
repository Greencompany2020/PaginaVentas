import React,{useState} from 'react';
import PropTypes from "prop-types";
import Image from 'next/image';
import tableIcon from '../public/icons/table.svg';
import statIcon from '../public/icons/stat.svg';
import statGroupIcon from '../public/icons/stat-group.svg';
import mobileTableIcon from '../public/icons/mobile-table.svg';

export default function ViewFilter(props) {
    const {viewOption, handleView, handleSelect, selectOption} = props;
    const [selectButton, setSelectButton] = useState(viewOption);

    const handleSplice = evt => {
        const {value} = evt.target;
        handleSelect(value);
    }

    const handleSelectView = numView => {
        handleView(numView);
        setSelectButton(numView)
    }


    return (
        <div className='flex flex-col space-y-1 items-stretch mb-1'>
            <section className='space-x-1 flex items-center'>
                <button 
                    className={`bg-slate-200 hover:bg-blue-400 rounded-md h-8 w-12 ${selectButton == 1  && 'bg-blue-400'}`} 
                    onClick={() =>handleSelectView(1)}
                >
                    <figure>
                        <Image src={tableIcon} width={24} alt={'icon'}/>
                    </figure>
                </button>
                <button 
                    className={`bg-slate-200 hover:bg-blue-400 rounded-md h-8 w-12 ${selectButton == 2  && 'bg-blue-400'}`} 
                    onClick={() =>handleSelectView(2)}
                >
                    <figure>
                        <Image src={statIcon} width={24} alt={'icon'}/>
                    </figure>
                </button>
                <button 
                    className={`bg-slate-200 hover:bg-blue-400 rounded-md h-8 w-12 ${selectButton == 3 && 'bg-blue-400'}`} 
                    onClick={() =>handleSelectView(3)}
                >
                    <figure>
                        <Image src={statGroupIcon} width={24} alt={'icon'}/>
                    </figure>
                </button>
                <button 
                    className={`bg-slate-200 hover:bg-blue-400 rounded-md h-8 w-12 ${selectButton == 4  && 'bg-blue-400'}`} 
                    onClick={() =>handleSelectView(4)}
                >
                    <figure>
                        <Image src={ mobileTableIcon} width={24} alt={'icon'}/>
                    </figure>
                </button>
            </section>
            <section className=''>
                <div className="space-x-2 flex items-center">
                    <label htmlFor="region" className='space-x-1 w-full'>
                    <span className='text-sm font-bold w[10%]'>Secciòn</span>
                    <select name="region" id="region" className='h-8 w-[73%] rounded-md bg-slate-200 ' onChange={handleSplice} value={selectOption}>
                        <option value="REGION I">Region I</option>
                        <option value="REGION II">Region II</option>
                        <option value="REGION III">Region III</option>
                        <option value="WEB">WEB</option>
                    </select>
                    </label>
                </div>
            </section>
        </div>
    )
}

ViewFilter.defaultProps = {
    viewOption: 1,
}

ViewFilter.propTypes = {
    viewOption: PropTypes.number.isRequired,
    handleView: PropTypes.func.isRequired,
    handleSelect: PropTypes.func.isRequired,
    selectOption: PropTypes.string.isRequired
}