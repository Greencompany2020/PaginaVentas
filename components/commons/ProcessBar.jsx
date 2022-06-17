import React, {useEffect} from 'react'

export default function ProcessBar(props) {
    const {show, progress} = props;
    return (
        <div className={`Alert-Modal ${show && 'active'} w-44 bg-slate-100`}>
            <div className=' h-3 w-full rounded-xl border-2 overflow-hidden'>
                <div
                    style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'green'
                    }}
                ></div>
            </div>
        </div>
    )
}
