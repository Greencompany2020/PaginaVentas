import { Flex } from '../containers';
import { plazas } from '../../utils/data';

const SelectPlazas = ({ classLabel, onChange, value }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="plaza" className={classLabel}>Plaza: </label>
      <select name="plaza" value={value} className='select ml-2' onChange={onChange}>
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
