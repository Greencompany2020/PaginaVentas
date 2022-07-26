import React from 'react'
import { checkboxLabels, comboNames, comboValues } from '../../utils/data';
export default function SelectCompromiso({value, onChange}) {
  return (
    <label htmlFor="incremento" className='flex flex-col text-sm font-semibold'>
        <span>{checkboxLabels.CBINCREMENTO}</span>
        <select name="incremento" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange}>
        {
           comboValues.CBINCREMENTO.map((item, i) => (
            <option key={i} value={item.value}>{item.text}</option>
           ))
        }
        </select>
    </label>
  )
}
