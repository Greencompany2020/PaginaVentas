
import { XIcon} from '@heroicons/react/outline';
const FormModal = ({name, active, handleToggle,children}) => {
    return(
        <>
            <div className={`modal-main ${active && 'active'}`} >
            <div className="modal-main-header">
                    <span className='font-semibold text-white'>{name || 'Modal'}</span>
                    <XIcon width={28} className='cursor-pointer text-white' onClick={handleToggle}/>
                </div>
                <div className='modal-main-body'>
                    {children}
                </div>
            </div>
            {/*Overlay*/}
            <div className={`${!active && 'hidden'}  fixed top-0 right-0 w-screen min-h-screen bg-gray-500 z-10 opacity-80`}/>
        </>
    )
}

export default FormModal;