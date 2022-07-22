import { useAuth } from '../../context/AuthContext';
import { Flex } from '../containers';

const SelectTiendas = ({ onChange, value }) => {

  const {tiendas} = useAuth();
  
  const TiendasItem = ({tiendas}) => {
    if(!tiendas) return <></>
    const Item = tiendas.map(tienda => (
      <option value={`${tienda.EmpresaWeb}${tienda.NoTienda}`} key={tienda.Descrip}>{tienda.Descrip}</option>
    ));
    return Item;
  }

  return (
    <label htmlFor="mes" className='flex flex-col text-sm'>
      <span className='font-semibold'>Tienda</span> 
      <select name="tienda" value={value} className='h-8 border rounded-md pl-2 border-slate-400' onChange={onChange}>
        <TiendasItem tiendas={tiendas}/>
      </select>
    </label>
  )
}

export default SelectTiendas
