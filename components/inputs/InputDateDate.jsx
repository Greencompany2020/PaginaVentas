import { Flex } from '../containers';

const InputDateDate = () => {
  return (
    <div className='flex flex-col pr-16'>
      <Flex className='xl:justify-between mb-2'>
        <label htmlFor="fechaInicio">Del:</label>
        <input type="date" name='fechaInicio' className='ml-3 outline-none border border-gray-300 rounded-md' />
      </Flex>
      <Flex className='xl:justify-between'>
        <label htmlFor="fechaFinal">Al:</label>
        <input type="date" name='fechaFinal' className='ml-5 outline-none border border-gray-300 rounded-md' />
      </Flex>
    </div>
  )
}

export default InputDateDate
