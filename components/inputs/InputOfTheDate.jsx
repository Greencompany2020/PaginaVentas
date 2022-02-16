import { Flex } from '@components/containers'

const InputDate = ({ value, onChange }) => {
  return (
    <Flex className='mb-3 items-center'>
      <label htmlFor="fecha">De la fecha: </label>
      <input type="date" name="fecha" id="" className='select ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputDate
