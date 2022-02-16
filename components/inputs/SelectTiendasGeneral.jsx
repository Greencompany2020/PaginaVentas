import { Flex } from '@components/containers';
import { tiendasGeneral } from '../../utils/data'

const SelectTiendasGeneral = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="tiendas">Tienda: </label>
      <select name="tiendas" className='select ml-2' value={value} onChange={onChange}>
        {
          tiendasGeneral.map(tienda => (
            <option value={tienda.value} key={tienda.text}>{tienda.text}</option>
          ))
        }
      </select>
    </Flex>
  )
}

export default SelectTiendasGeneral
