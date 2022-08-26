import React from 'react'
import Input from './Input';
import PropTypes from 'prop-types';

export default function DateRange(props) {
    const {begindDate, endDate, legend} = props;
    return (
        <fieldset className='border border-slate-400 p-2 rounded-md'>
            <legend className='text-sm font-semibold text-slate-700'>{legend}</legend>
            <div className='flex w-full items-center space-x-1'>
                <Input type="date" {...begindDate} />
                <span className='relative top-2 '>:</span>
                <Input type="date" {...endDate} />
            </div>
        </fieldset>
    )
}

DateRange.propTypes = {
    legend: PropTypes.string,
    begindDate: PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        disabled: PropTypes.bool,
        placeholder: PropTypes.any,
    }),
    endDate: PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        disabled: PropTypes.bool,
        placeholder: PropTypes.any,
    }),
}

DateRange.defaultProps = {
    legend: 'Rango de fechas',
    begindDate: {
        id:'beginDate',
        name:'beginDate',
        label:'Fecha inicial',
        disabled: false,
        placeholder: ''
    },
    endDate: {
        id:'endDate',
        name:'endDate',
        label:'Fecha final',
        disabled: false,
        placeholder: ''
    },
}


