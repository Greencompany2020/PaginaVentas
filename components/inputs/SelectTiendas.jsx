import { Flex } from '../containers';
import { useAppState } from '../../context/useAppState';

const SelectTiendas = ({ onChange, value }) => {
  const { tiendas } = useAppState();
  
  return (
    <Flex className='mb-3'>
      <label htmlFor="mes">Tienda: </label>
      <select name="tienda" value={value} className='select ml-2' onChange={onChange}>
        {
          tiendas.map(item => (
            <option value={`${item.EmpresaWeb}${item.NoTienda}`} key={item.Descrip}>{item.Descrip}</option>
          ))
        }
      </select>
    </Flex>
  )
}

export default SelectTiendas
