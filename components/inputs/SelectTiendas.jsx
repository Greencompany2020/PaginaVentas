import { useUser } from '../../context/UserContext';
import { Flex } from '../containers';

const SelectTiendas = ({ onChange, value }) => {

  const {tiendas} = useUser();
  
  const TiendasItem = ({tiendas}) => {
    if(!tiendas) return <></>
    const Item = tiendas.map(tienda => (
      <option value={`${tienda.EmpresaWeb}${tienda.NoTienda}`} key={tienda.Descrip}>{tienda.Descrip}</option>
    ));
    return Item;
  }

  return (
    <Flex className='mb-3'>
      <label htmlFor="mes">Tienda: </label>
      <select name="tienda" value={value} className='select ml-2' onChange={onChange}>
        <TiendasItem tiendas={tiendas}/>
      </select>
    </Flex>
  )
}

export default SelectTiendas
