import { Flex } from '../../components/containers';

const InputDateRange = ({ beginDate, endDate, onChange }) => {
  return (
    <div className='flex flex-col pr-16'>
      <Flex className='xl:justify-between mb-2'>
        <label htmlFor="fechaInicio">Fecha inicial:</label>
        <input
          type="date"
          name='fechaInicio'
          className='ml-3 outline-none border border-gray-300 rounded-md'
          onChange={onChange}
          value={beginDate}
        />
      </Flex>
      <Flex className='xl:justify-between'>
        <label htmlFor="fechaFin">Fecha final:</label>
        <input
          type="date"
          name='fechaFin'
          className='ml-5 outline-none border border-gray-300 rounded-md'
          onChange={onChange}
          value={endDate}
        />
      </Flex>
    </div>
  )
}

export default InputDateRange
