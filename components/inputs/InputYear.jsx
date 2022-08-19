import { Flex } from "../containers";

const InputYear = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  return (
    <label htmlFor="anio" className="flex flex-col text-sm">
      <span className="font-semibold">Del año</span> 
      <select name="delAgno" id="anio" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange}>
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
  );
};

export default InputYear;
