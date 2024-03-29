import { isSafari, isMobile } from "react-device-detect";

const InputDateRange = ({ beginDate, endDate, onChange }) => {

  return (
    <label className='block text-sm border border-slate-400 p-2 rounded-md'>
      <span className='block mb-1 font-semibold'>Rango de fecha</span>
      <div className='flex justify-evenly items-center'>
        <div className='flex-1' >
          <span className='text-xs font-semibold'>Inicio</span>
          <div className={'relative flex items-center space-x-2'}>
            <input name='fechaInicio' value={beginDate} onChange={onChange} type="date" placeholder={beginDate} className={'w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none'} />
            {(isSafari && !isMobile) && <span className="absolute right-4">{beginDate}</span>}
          </div>

        </div>
        <span className='font-bold pl-1 pr-1 relative top-2'>:</span>
        <div className='flex-1'>
          <span className='text-xs font-semibold'>Fin</span>
          <div className={'relative flex items-center space-x-2'}>
            <input name='fechaFin' value={endDate} onChange={onChange} type="date" placeholder={endDate} className={'w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none'} />
            {(isSafari && !isMobile) && <span className="absolute right-4">{endDate}</span>}
          </div>
        </div>
      </div>
    </label>
  )
}

export default InputDateRange
