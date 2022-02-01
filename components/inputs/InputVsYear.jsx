import { Flex } from '@components/containers';

const InputVsYear = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="anio">Vs. Año: </label>
      <input type="number" name="anio" id="" className='select ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputVsYear
