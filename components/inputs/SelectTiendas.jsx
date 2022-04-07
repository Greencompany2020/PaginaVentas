
import { Flex } from '../containers';
import { tiendas } from '../../utils/data';

const SelectTiendas = ({ onChange, value }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="mes">Tienda: </label>
      <select name="tienda" value={value} className='select ml-2' onChange={onChange}>
        {
          tiendas.map(item => (
            <option value={item.value} key={item.text}>{item.text}</option>
          ))
        }
      </select>
    </Flex>
  )
}

export default SelectTiendas
