import { Flex } from '../containers';
import { meses } from '../../utils/data'

const SelectMonth = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="delMes">Del Mes: </label>
      <select name="delMes" value={value} className='select ml-2' onChange={onChange}>
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
