import { Flex } from '@components/containers';
import { tiendasGeneral } from 'utils/data'

const SelectTiendasGeneral = () => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="mes">Tienda: </label>
      <select name="mes" id="" className='select ml-2'>
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
