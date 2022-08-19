import { Flex } from '../containers';
import { meses } from '../../utils/data'

const SelectMonth = ({ value, onChange }) => {
  return (
    <label htmlFor="delMes" className='flex flex-col text-sm'>
      <span className='font-semibold'>Del mes</span>
      <select name="delMes" value={value} className='h-8 border rounded-md pl-2 border-slate-400' onChange={onChange}>
        {
          meses.map(mes => (
            <option value={mes.value} key={mes.text}>{mes.text}</option>
          ))
        }
      </select>
    </label>
  )
}

export default SelectMonth
