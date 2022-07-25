import { useRef } from "react";
export default function InputDateComparative({firstYear, secondYear, onChange, cbEnabledYears, changeEnabled}) {
  const currentYear = new Date().getFullYear();
  const firstYearRef = useRef(null);
  const secondYearRef = useRef(null);

  const handleOnchange = evt =>  {
    if(cbEnabledYears == 1 || (evt.target == firstYearRef.current)){
      const {value} = evt.target;
      const newArr = [value, secondYear];

      onChange( prev => ({
        ...prev,
        agnosComparar: newArr
      }));

    }else{
      const {value} = evt.target;
      const newArr = [firstYear, value];

      onChange( prev => ({
        ...prev,
        agnosComparar: newArr
      }));
    }
  }

  return (
   <label className='block text-sm border border-slate-400 p-2 rounded-md'>
      <span className='block font-semibold mb-1'>Comparativa de años</span>
      <div className='space-y-1'>
        <div className=''>
          <span className='block text-xs font-semibold'>Años a comparar</span>  
          <select 
            name="cbAgnosComparar" 
            className=' flex-1 w-full h-8 border rounded-md pl-2 border-slate-400' 
            value={cbEnabledYears}
            onChange={(evt) =>  changeEnabled(evt.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className='flex space-x-1'>
          <div className='flex-1'>
            <span className='block text-xs font-semibold'>Año 1</span>  
            <select 
              className=' flex-1 w-full h-8 border rounded-md pl-2 border-slate-400'
              value={firstYear }
              onChange={handleOnchange}
              ref = {firstYearRef}
            >
            {
              (()=>{
                if(currentYear){
                  const Items = []
                  for(let dem = currentYear; dem >= 2013; dem--){
                    Items.push(<option value={dem} key={dem}>{dem}</option>)
                  }
                  return Items;
                }
              })()
            }
            </select>
          </div>
          <div className='flex-1'>
            <span className='block text-xs font-semibold'>Año 2</span>  
              <select 
                className=' flex-1 w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 disabled:text-gray-400'
                value={secondYear}
                onChange={handleOnchange}
                disabled = {cbEnabledYears == 1}
                ref = {secondYearRef}
              >
              {
                (()=>{
                  if(currentYear){
                    const Items = []
                    for(let dem = currentYear; dem >= 2013; dem--){
                      Items.push(<option value={dem} key={dem}>{dem}</option>)
                    }
                    return Items;
                  }
                })()
              }
            </select>
          </div>
        </div>
      </div>
   </label>
  )
}
