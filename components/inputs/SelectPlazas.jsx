import { useAppState } from '../../context/useAppState';
import { Flex } from '../containers';

const SelectPlazas = ({ classLabel, onChange, value }) => {
  const { plazas } = useAppState();

  return (
    <Flex className='mb-3'>
      <label htmlFor="plaza" className={classLabel}>Plaza: </label>
      <select name="plaza" value={plazas[0]?.NoEmpresa} className='select ml-2' onChange={onChange}>
        {
          plazas.map(plaza => (
            <option value={plaza.NoEmpresa} key={plaza.DescCta}>{plaza.DescCta}</option>
          ))
        }
      </select>
    </Flex>
  )
}

export default SelectPlazas
