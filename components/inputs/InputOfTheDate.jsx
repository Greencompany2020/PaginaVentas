import { isSafari } from 'react-device-detect';

const InputDate = ({ value, onChange }) => {
  return (
    <label htmlFor="fecha" className='flex flex-col text-sm'>
      <span className='font-semibold'>De la fecha</span>
      <div className={'relative flex items-center space-x-2'}>
        <input type="date" name="fecha" id="" placeholder={value} className={'w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none'} value={value} onChange={onChange} />
        {isSafari && <span className="absolute right-4">{value}</span>}
      </div>
    </label>
  )
}

export default InputDate
