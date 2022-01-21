import { Flex } from '@components/containers';
import { meses } from 'utils/data'

const SelectMonth = () => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="mes">Del Mes: </label>
      <select name="mes" id="" className='select ml-2'>
        {
          meses.map(mes => (
            <option value={mes.value} key={mes.text}>{mes.text}</option>
          ))
        }
      </select>
    </Flex>
  )
}

export default SelectMonth
