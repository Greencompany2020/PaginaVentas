import { Flex } from '@components/containers';

const InputToYear = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="alAnio">Al Año: </label>
      <input type="number" name="alAnio" id="" className='select ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputToYear
