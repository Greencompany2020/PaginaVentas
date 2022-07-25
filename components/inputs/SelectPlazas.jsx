import { useAuth } from '../../context/AuthContext';

const SelectPlazas = ({ onChange, value }) => {
  
  const {plazas} = useAuth();

  const PlazasItem = ({plazas}) => {
    if(!plazas) return <></>
    const Item = plazas.map(plaza => (
      <option value={plaza.NoEmpresa} key={plaza.DescCta}>{plaza.DescCta}</option>
    ))
    return Item;
  }

  return (
    <label htmlFor="plaza" className='flex flex-col text-sm'>
      <span className='font-semibold'>Plaza</span> 
      <select name="plaza" value={value} className='h-8 border rounded-md pl-2 border-slate-400' onChange={onChange}>
        <PlazasItem plazas={plazas}/>
      </select>
    </label>
  )
}

export default SelectPlazas
