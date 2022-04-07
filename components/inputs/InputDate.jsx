import { Flex } from "../containers"

const InputDate = ({ value, onChange }) => {
  return (
    <Flex className='mb-3 items-center'>
      <label htmlFor="fecha">A la Fecha: </label>
      <input type="date" name="fecha" id="" className='outline-none border border-gray-300 rounded-md ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputDate
