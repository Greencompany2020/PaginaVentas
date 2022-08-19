import { Flex } from "../containers"

const InputRangos = ({ value, onChange }) => {
  return (
    <label htmlFor="rangos" className="flex flex-col text-sm">
      <span className="font-semibold">Rangos</span>
      <input type="text" name="rangos" id="" className='h-8 border rounded-md pl-2 border-slate-400' value={value} onChange={onChange} />
    </label>
  )
}

export default InputRangos
