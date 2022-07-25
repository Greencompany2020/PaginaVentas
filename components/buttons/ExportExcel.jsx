import React from 'react'

export default function ExportExcel({handleClick}) {
    return (
        <button type={'button'} className="bg-slate-200 hover:bg-blue-400 rounded-md h-8 w-24" onClick={handleClick}>
            Exportar
        </button>
    )
}
