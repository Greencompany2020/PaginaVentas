export default function TooggleSwitch({id,value, onChange}){

    return(
        <label htmlFor={id} className=" block w-12 h-6 cursor-pointer relative rounded-full bg-gray-200">
            <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={value}
                onChange={onChange}
                id={id}
            />
            <span className='block w-4 h-4 absolute left-1 top-1 rounded-full bg-red-500 transition-all duration-500 peer-checked:bg-green-500 peer-checked:left-7'></span>
        </label>
    )
}