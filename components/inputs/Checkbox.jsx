import { Flex } from '@components/containers';

const Checkbox = ({ className, labelText }) => {
  return (
    <Flex className={`items-center ${className}`}>
      <input type="checkbox" className='h-5 w-5 mr-1' /><label>{labelText}</label>
    </Flex>
  )
}

export default Checkbox
