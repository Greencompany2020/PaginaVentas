import { Flex } from "../containers";

const InputYear = ({ value, onChange }) => {
  const currentYear = new Date().getFullYear();
  return (
    <Flex className="mb-3">
      <label htmlFor="anio">Del Año: </label>
      <select name="delAgno" id="anio" className='select ml-2' value={value} onChange={onChange}>
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
    </Flex>
  );
};

export default InputYear;
