
import { useEffect } from 'react';
import { XIcon} from '@heroicons/react/outline';
const FormModal = ({name, active, handleToggle,children}) => {

    const handleKeyDown = e => {
        if (active && (e.key == 'Escape' || e.key == 'Esc')){
            handleToggle();
        } 
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [active])



    return(
        <>
            <div className={`modal-main ${active && 'active'}`} >
            <div className="modal-main-header">
                    <span className='font-semibold text-white'>{name || 'Modal'}</span>
                    <XIcon width={28} className='cursor-pointer text-white' onClick={handleToggle}/>
                </div>
                <div className='p-2'>
                    {children}
                </div>
            </div>
            {/*Overlay*/}
            <div className={`${!active && 'hidden'}  fixed top-0 right-0 w-screen min-h-screen bg-gray-500 z-20 opacity-80`}/>
        </>
    )
}

export default FormModal;