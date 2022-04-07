import { Flex } from "../containers"

const InputVsYear = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="versusAgno">Vs. Año: </label>
      <input type="number" name="versusAgno" id="" className='select ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputVsYear
