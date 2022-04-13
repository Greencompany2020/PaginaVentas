
import { Flex } from '../containers'
import { meses } from '../../utils/data'

const SelectToMonth = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="alMes">Al Mes: </label>
      <select name="alMes" value={value} className='select ml-2' onChange={onChange}>
        {
          meses.map(almes => (
            <option value={almes.value} key={almes.text}>{almes.text}</option>
          ))
        }
      </select>
    </Flex>
  )
}

export default SelectToMonth
