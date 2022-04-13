import { Flex } from '../containers';

const InputToYear = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="alAgno">Al Año: </label>
      <input type="number" name="alAgno" id="" className='select ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputToYear
