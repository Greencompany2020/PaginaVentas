import { Flex } from '../containers';

const InputDateRange = ({ beginDate, endDate, onChange }) => {
  return (
    <label className='text-sm'>
      <span className='font-semibold'>Rango de fecha</span>
      <div className='flex justify-evenly items-center'>
        <div className='flex-1' >
          <span className='text-xs font-semibold'>Inicio</span>
          <input name='fechaInicio' value={beginDate} onChange={onChange} type="date" className='w-full h-8 border rounded-md pl-2 border-slate-400 outline-none'/>
        </div>
        <span className='font-bold pl-1 pr-1 relative top-2'>:</span>
        <div className='flex-1'>
          <span className='text-xs font-semibold'>Fin</span>
          <input name='fechaFin' value={endDate} onChange={onChange} type="date" className='w-full h-8 border rounded-md pl-2 border-slate-400 outline-none' />
        </div>
      </div>
    </label>
  )
}

export default InputDateRange
