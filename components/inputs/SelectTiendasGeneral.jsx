import { tiendasGeneral } from '../../utils/data'

const SelectTiendasGeneral = ({ value, onChange }) => {
  return (
    <label htmlFor="tiendas" className='flex flex-col text-sm'>
    <span className='font-semibold'>Tienda</span> 
      <select name="tiendas" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange}>
        {
          tiendasGeneral.map(tienda => (
            <option value={tienda.value} key={tienda.text}>{tienda.text}</option>
          ))
        }
      </select>
    </label>
  )
}

export default SelectTiendasGeneral
