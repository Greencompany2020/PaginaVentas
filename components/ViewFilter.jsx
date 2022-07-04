import React,{useState} from 'react';
import PropTypes from "prop-types";
import {XIcon} from '@heroicons/react/solid'

export default function ViewFilter(props) {
    const {viewOption, handleView, handleSelect, selectOption} = props;
    const [lastView, setLastView] = useState(viewOption);
    const handleLastView = () => {
        setLastView(viewOption);
        handleView(3)
    }
    const handleSplice = evt => {
        const {value} = evt.target;
        handleSelect(value);
    }


    return (
        viewOption !== 3 ?
        <div className="space-x-2 flex items-center">
            <button className="bg-slate-200 hover:bg-slate-300 rounded-md h-8 w-12" onClick={() => handleView(1)}>Vista 1</button>
            <button className="bg-slate-200 hover:bg-slate-300 rounded-md h-8 w-12" onClick={() => handleView(2)}>Vista 2</button>
            <button className="bg-slate-200 hover:bg-slate-300 rounded-md h-8 w-12" onClick={handleLastView}>Vista 3</button>
            <button className="bg-slate-200 hover:bg-slate-300 rounded-md h-8 w-12" onClick={() => handleView(4)}>Vista 4</button>
        </div>
        :
        <div className="space-x-2 flex items-center">
                <label htmlFor="" className='space-x-1'>
                <span className='font-bold'>Seccion</span>
                <select name="region" id="region" className='h-8 rounded-md bg-slate-200' onChange={handleSplice} value={selectOption}>
                    <option value="REGION I">Region I</option>
                    <option value="REGION II">Region II</option>
                    <option value="REGION III">Region III</option>
                    <option value="WEB">WEB</option>
                </select>
                </label>
                <button 
                    className="bg-slate-200 hover:bg-slate-300 rounded-md h-8 w-12 flex justify-center" 
                    onClick={() => handleView(lastView)}
                >
                    <XIcon width={24}/>
                </button>
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