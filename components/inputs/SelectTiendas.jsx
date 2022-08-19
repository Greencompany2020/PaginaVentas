import { useSelector } from 'react-redux';
import { v4 } from 'uuid';

const SelecTiendas = ({ onChange, value }) => {

  const {shops} = useSelector(state => state);
  
  const ShopsItem = ({shops}) => {
    if(!shops) return <></>
    const Item = shops.map(tienda => (
      <option value={`${tienda.EmpresaWeb}${tienda.NoTienda}`} key={v4()}>{tienda.Descrip}</option>
    ));
    return Item;
  }

  return (
    <label htmlFor="mes" className='flex flex-col text-sm'>
      <span className='font-semibold'>Tienda</span> 
      <select name="tienda" value={value} className='h-8 border rounded-md pl-2 border-slate-400' onChange={onChange}>
        <ShopsItem shops={shops}/>
      </select>
    </label>
  )
}

export default SelecTiendas
