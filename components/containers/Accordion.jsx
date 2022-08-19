import { ChevronDownIcon} from '@heroicons/react/solid';
import {useRef, useState} from 'react';

const Accordion = ({name, children, ...rest}) => {

    const collapseRef = useRef(null);
    const [active, setActive] = useState(false);
    const handleActive = () => {
        if(active){
            collapseRef.current.classList.remove('active');
            setActive(false);
        }else{
            collapseRef.current.classList.add('active');
            setActive(true);
        }
    }

    return (
        <>
            <div className='Accordion' onClick={handleActive}>
               <span className='font-semibold text-lg'>{name}</span>
               <ChevronDownIcon onClick={handleActive} className={`Accordion-button ${active ? 'active': null}`}/>
            </div>
            <section className='Collapse-Accordion' ref={collapseRef}>
                {children}
            </section>
        </>
    )
}

export default Accordion;