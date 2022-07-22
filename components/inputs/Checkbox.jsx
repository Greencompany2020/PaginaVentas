const Checkbox = ({labelText, name, onChange, checked, disabled = false}) => {
  return (
    
    <label htmlFor={name} className='flex flex-row items-center space-x-1 text-sm font-semibold'>
        <input 
         id={name} 
         type="checkbox" 
         name={name}
         onChange={onChange} 
         checked={checked}
         disabled={disabled}
        />
        <span className={`truncate ${disabled && 'text-gray-300 text-sm'}`}>{labelText}</span>
    </label>
  )
}

export default Checkbox
