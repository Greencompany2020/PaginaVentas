import { useAuth } from '../../context/AuthContext';
import { Flex } from '../containers';

const SelectPlazas = ({ classLabel, onChange, value }) => {
  
  const {plazas} = useAuth();

  const PlazasItem = ({plazas}) => {
    if(!plazas) return <></>
    const Item = plazas.map(plaza => (
      <option value={plaza.NoEmpresa} key={plaza.DescCta}>{plaza.DescCta}</option>
    ))
    return Item;
  }

  return (
    <Flex className='mb-3'>
      <label htmlFor="plaza" className={classLabel}>Plaza: </label>
      <select name="plaza" value={value} className='select ml-2' onChange={onChange}>
        <PlazasItem plazas={plazas}/>
      </select>
    </Flex>
  )
}

export default SelectPlazas
