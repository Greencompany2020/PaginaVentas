
import { XCircleIcon} from '@heroicons/react/outline';
const FormModal = ({name, children}) => {
    return(
        <div className='Form-modal' >
           <div className="flex flex-row flex-nowrap justify-between p-2 border-b items-center">
                <span className='text-[16px] text-white font-semibold'>{name || 'Modal'}</span>
                <XCircleIcon className='w-[32px] cursor-pointer text-white'/>
            </div>
            <section className=' p-[4px]'>
                <div className=' bg-slate-50 rounded-md min-w-[400px] min-h-[200px]'>
                    {children}
                </div>
            </section>
        </div>
    )
}

export default FormModal;