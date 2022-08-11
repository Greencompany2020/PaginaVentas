import { useField } from "formik";

export const Input = ({label, ...props}) => {
    const [field, meta] = useField(props);
    return(
        <label className="flex flex-col text-sm font-semibold" htmlFor={props?.id || props?.name}>
            <input
                className={`
                    h-8 border rounded-md pl-2 ${(meta.touched && meta.error) ? 'border-red-400' : 'border-slate-400' } 
                    disabled:bg-gray-100 disabled:border-gray-100
                `}  
                {...field} {...props} 
            />
             {(meta.touched && meta.error) &&  <span className='font-semibold text-red-500 text-right'>{meta.error}</span>}
        </label>
    )
}