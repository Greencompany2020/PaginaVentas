import { useRef } from "react";
export default function InputDateComparative({firstYear, secondYear, onChange, cbEnabledYears, changeEnabled}) {
  const currentYear = new Date().getFullYear() - 1;
  const firstYearRef = useRef(null);
  const secondYearRef = useRef(null);
  const cbEnableRef = useRef(null);

  const handleOnchange = evt =>  {
    const {value} = evt.target;
    const {target} = evt;

    if(target === cbEnableRef.current){
      changeEnabled(value);
      if(value == 1){
        onChange(prev => ({...prev, agnosComparar:[firstYearRef.current.value]}));
      }else{
        onChange(prev => ({...prev, agnosComparar:[firstYearRef.current.value, secondYearRef.current.value]}));
      }
    }
    else if(target == firstYearRef.current && cbEnableRef.current.value == 1){
      onChange(prev => ({...prev, agnosComparar:[firstYearRef.current.value]}));
    }
    else{
      onChange(prev => ({...prev, agnosComparar:[firstYearRef.current.value, secondYearRef.current.value]}));
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
            onChange={handleOnchange}
            ref = {cbEnableRef}
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
