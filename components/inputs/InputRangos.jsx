import { Flex } from "../containers"

const InputRangos = ({ value, onChange }) => {
  return (
    <Flex className="mb-3 mt-2">
      <label htmlFor="rangos">Rangos: </label>
      <input type="text" name="rangos" id="" className='outline-none border border-gray-300 w-full rounded-md h-7 ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputRangos
