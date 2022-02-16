import { Flex } from '@components/containers';
import { meses } from 'utils/data'

const SelectToMonth = () => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="almes">Al Mes: </label>
      <select name="almes" id="" className='select ml-2'>
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
