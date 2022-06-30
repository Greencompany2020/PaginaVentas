import { Flex } from '../containers';

const Checkbox = ({ className, labelText, name, onChange, checked, disabled = false}) => {
  return (
    
    <label htmlFor={name} className='flex flex-row items-center'>
        <input 
         id={name} 
         type="checkbox" 
         name={name} className='h-5 w-5 mr-1' 
         onChange={onChange} 
         checked={checked}
         disabled={disabled}
        />
        <span className={`truncate ${disabled && 'text-gray-300'}`}>{labelText}</span>
    </label>
  )
}

export default Checkbox
