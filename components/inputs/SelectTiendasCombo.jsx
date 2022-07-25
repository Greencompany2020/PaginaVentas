import React from 'react';
import { checkboxLabels, comboNames, comboValues } from '../../utils/data';

export default function SelectTiendasCombo({value, onChange}) {
  return (
    <label htmlFor="tiendas" className='flex flex-col text-sm'>
        <span className='font-semibold'>{checkboxLabels.CBMOSTRARTIENDAS}</span>
        <select name="tiendas" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange}>
        {
           comboValues.CBMOSTRARTIENDAS.map((item, i) => (
            <option key={i} value={item.value}>{item.text}</option>
           ))
        }
        </select>
    </label>
  )
}
