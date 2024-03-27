import React from 'react';
import Input from './Input';
import Select from './Select';
import PropTypes from 'prop-types';

export default function BeetwenYears(props) {
    const {begindDate,enabledDates, endDate, legend} = props;
    return (
        <fieldset className='border border-slate-400 p-2 rounded-md space-y-1'>
            <legend className='text-sm font-semibold text-slate-700'>{legend}</legend>
            <Select {...enabledDates}>
                <option value="1">1</option>
                <option value="2">2</option>
            </Select>
            <div className='grid grid-cols-2 gap-1'>
                <Input type='number' {...begindDate} />
                <Input type='number' {...endDate} />
            </div>
        </fieldset>
    )
}

BeetwenYears.propTypes = {
    legend: PropTypes.string,
    enabledDates: PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string
    }),
    begindDate: PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
    }),
    endDate: PropTypes.exact({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        disabled: PropTypes.bool,
    }),
}


BeetwenYears.defaultProps = {
    legend: 'Comparar entre años',
    enabledDates:{
        id:'enabledDates',
        name:'enabledDate',
        label:'Comparar entre los años',
    },
    begindDate: {
        id:'beginDate',
        name:'beginDate',
        label:'Primer año',
        disabled: false,
    },
    endDate: {
        id:'endDate',
        name:'endDate',
        label:'Segundo año',
        disabled: false,
    },
}

