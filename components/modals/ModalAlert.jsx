import ProviderAlert from "../../context/alertContext";
import { useAlert } from "../../context/alertContext";
import {EmojiSadIcon, EmojiHappyIcon} from '@heroicons/react/solid'

function Modal(){
    const {state} = useAlert();
    return(
        <div className={`Alert-Modal ${state.type} ${state.show && 'active'}`}>
            {
                (state.type == 'info') ?
                <EmojiHappyIcon  width={32} className=' text-white'/> :
                <EmojiSadIcon width={32} className=' text-white'/>
            }
            <p className=" font-semibold text-md text-white">{state.message}</p>
        </div>
    )
}

export default function ModalAlert({children}){
    return(
        <ProviderAlert>
            {children}
            <Modal/>
        </ProviderAlert>
    )
}