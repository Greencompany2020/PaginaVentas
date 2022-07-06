import { Flex } from '../containers';

const Checkbox = ({ className, labelText, name, onChange, checked, disabled = false}) => {
  return (
    
    <label htmlFor={name} className='flex flex-row items-center space-x-1'>
        <input 
         id={name} 
         type="checkbox" 
         name={name} className='w-4' 
         onChange={onChange} 
         checked={checked}
         disabled={disabled}
        />
        <span className={`truncate ${disabled && 'text-gray-300 text-sm'}`}>{labelText}</span>
    </label>
  )
}

export default Checkbox
