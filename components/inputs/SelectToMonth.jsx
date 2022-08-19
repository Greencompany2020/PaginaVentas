
import { Flex } from '../containers'
import { meses } from '../../utils/data'

const SelectToMonth = ({ value, onChange }) => {
  return (
      <label htmlFor="alMes" className='flex flex-col text-sm'>
      <span className='font-semibold'>Al mes</span>
        <select name="alMes" value={value} className='h-8 border rounded-md pl-2 border-slate-400' onChange={onChange}>
          {
            meses.map(almes => (
              <option value={almes.value} key={almes.text}>{almes.text}</option>
            ))
          }
        </select>
      </label>
  )
}

export default SelectToMonth
