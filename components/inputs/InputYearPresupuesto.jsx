import { Flex } from '../containers';

const InputYear = ({ value, onChange }) => {
  return (
    <label htmlFor="anio" className='flex flex-col text-sm'>
      <span className='font-semibold'>Año presupuesto</span> 
      <input type="number" name="anio" id="" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange} />
    </label>
  )
}

export default InputYear
