import { Flex } from '@components/containers';
import { plazas } from 'utils/data';

const SelectPlazas = ({ classLabel }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="plaza" className={classLabel}>Plaza: </label>
      <select name="plaza" id="" className='select ml-2'>
        {
          plazas.map(plaza => (
            <option value={plaza.value} key={plaza.text}>{plaza.text}</option>
          ))
        }
      </select>
    </Flex>
  )
}

export default SelectPlazas
