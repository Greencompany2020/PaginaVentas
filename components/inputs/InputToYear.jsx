import { Flex } from '../containers';

const InputToYear = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  return (
    <label htmlFor="alAgno" className='flex flex-col text-sm'> 
      <span className='font-semibold'>Al año</span>
      <select type="number" name="alAgno" id="" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange}>
        {
          (()=>{
            if(currentYear){
              const Items = []
              for(let dem = currentYear; dem >= 2000; dem--){
                Items.push(<option value={dem} key={dem}>{dem}</option>)
              }
              return Items;
            }
          })()
        }
      </select>
    </label>
  )
}

export default InputToYear
