import { useSelector } from 'react-redux';
import { v4 } from 'uuid';

const SelectPlazas = ({ onChange, value }) => {
  
  const {places} = useSelector(state => state);

  const PlacesItem = ({places}) => {
    if(!places) return <></>
    const Item = places.map(plaza => (
      <option value={plaza.NoEmpresa} key={v4()}>{plaza.DescCta}</option>
    ))
    return Item;
  }

  return (
    <label htmlFor="plaza" className='flex flex-col text-sm'>
      <span className='font-semibold'>Plaza</span> 
      <select name="plaza" value={value} className='h-8 border rounded-md pl-2 border-slate-400' onChange={onChange}>
        <PlacesItem places={places}/>
      </select>
    </label>
  )
}

export default SelectPlazas
