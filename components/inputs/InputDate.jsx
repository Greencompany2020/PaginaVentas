import { Flex } from "../containers";
import { isSafari } from 'react-device-detect';

const InputDate = ({ value, onChange }) => {
    const styledForNotSafari = 'w-full h-8 border rounded-md pl-2 border-slate-400 disabled:bg-gray-100 disabled:border-gray-100 outline-none';
    const styledForSafari = 'w-12 bg-gray-300 border border-slate-400 rounded h-8 ';

    const styledForDivNotSafari = '';
    const styledForDivSafari = 'flex items-center space-x-2';

  return (
    <label htmlFor="fecha" className="flex flex-col text-sm">
      <span className="font-semibold">A la fecha</span>
      <div className= {isSafari ? styledForDivSafari : styledForDivNotSafari}>
        <input type="date" name="fecha" id="" placeholder={value} className={isSafari ? styledForSafari : styledForNotSafari} value={value} onChange={onChange} />
        { isSafari && <span className='font-bold'>{value}</span>}
      </div>
      
    </label>
  )
}

export default InputDate
