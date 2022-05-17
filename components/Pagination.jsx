import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/solid'

export default function Pagination({pages, current ,next, back}){
    
    return(
        <div className='w-full flex justify-center'>
            <div className='w-fit bg-slate-200 rounded-md flex items-center'>
                <button 
                    className='w-12 h-10 bg-slate-300 rounded-l-md flex justify-center items-center'
                    onClick={() => next(current - 1)}
                ><ChevronLeftIcon width={28}/></button>
                {(()=>{
                    if(!pages) return <></>
                    const items = [];
                    for(let i = 0; i < pages; i++){
                        items.push( 
                            <button 
                                key={i}
                                className={`w-12 h-10 hover:bg-indigo-200 ${(i+1 == current) && 'bg-indigo-400 text-white font-bold'}`}
                                onClick={() => next(i+1)}
                            >
                            {i+1}</button>
                        )
                    }
                    return items;
                })()}
                <button 
                    className='w-12 h-10 bg-slate-300 rounded-r-md flex justify-center items-center'
                    onClick={() => next(current + 1)}
                ><ChevronRightIcon width={28}/></button>
            </div>
        </div>
    )
}