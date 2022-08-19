import { Flex } from "../containers"

const InputVsYear = ({ value, onChange }) => {
  return (
    <label htmlFor="versusAgno" className="flex flex-col text-sm">
      <span className="font-semibold">Vs. Año:</span>
      <input type="number" name="versusAgno" id=""  className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange} />
    </label>
  )
}

export default InputVsYear
