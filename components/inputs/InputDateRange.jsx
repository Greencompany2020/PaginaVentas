import { isSafari } from "react-device-detect";

const InputDateRange = ({ beginDate, endDate, onChange }) => {

  const styledForNotSafari = 'w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none';
  const styledForSafari = 'w-12 bg-gray-300 border border-slate-400 rounded h-8 ';

  const styledForDivNotSafari = '';
  const styledForDivSafari = 'flex items-center space-x-2';


  return (
    <label className='block text-sm border border-slate-400 p-2 rounded-md'>
      <span className='block mb-1 font-semibold'>Rango de fecha</span>
      <div className='flex justify-evenly items-center'>
        <div className='flex-1' >
          <span className='text-xs font-semibold'>Inicio</span>
          <div className={isSafari ? styledForDivSafari : styledForDivNotSafari}>
            <input name='fechaInicio' value={beginDate} onChange={onChange} type="date" placeholder={beginDate} className={isSafari ? styledForSafari : styledForNotSafari} />
            {isSafari && <span className="font-bold">{beginDate}</span>}
          </div>

        </div>
        <span className='font-bold pl-1 pr-1 relative top-2'>:</span>
        <div className='flex-1'>
          <span className='text-xs font-semibold'>Fin</span>
          <div className={isSafari ? styledForDivSafari : styledForDivNotSafari}>
            <input name='fechaFin' value={endDate} onChange={onChange} type="date" placeholder={endDate} className={isSafari ? styledForSafari : styledForNotSafari} />
          </div>
        </div>
      </div>
    </label>
  )
}

export default InputDateRange
