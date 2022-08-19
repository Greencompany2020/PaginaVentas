import { Flex } from '../containers'

const InputDate = ({ value, onChange }) => {
  return (
    <label htmlFor="fecha" className='flex flex-col text-sm'>
      <span className='font-semibold'>De la fecha</span>
      <input type="date" name="fecha" id="" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange} />
    </label>
  )
}

export default InputDate
