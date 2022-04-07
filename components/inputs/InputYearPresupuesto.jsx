import { Flex } from '../containers';

const InputYear = ({ value, onChange }) => {
  return (
    <Flex className='mb-3'>
      <label htmlFor="anio">Año Presupuesto: </label>
      <input type="number" name="anio" id="" className='select ml-2' value={value} onChange={onChange} />
    </Flex>
  )
}

export default InputYear
