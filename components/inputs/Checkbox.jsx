import { Flex } from '../containers';

const Checkbox = ({ className, labelText, name, onChange, checked }) => {
  return (
    <Flex className={`items-center ${className}`}>
      <input type="checkbox" name={name} className='h-5 w-5 mr-1' onChange={onChange} checked={checked} /><label>{labelText}</label>
    </Flex>
  )
}

export default Checkbox
