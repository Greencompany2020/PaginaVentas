import Image from "next/image"

export default function ExcelButton({handleClick}) {
    return (
        <button type={'button'} className="bg-slate-200 hover:bg-blue-400 rounded-md h-10 w-10 flex justify-center items-center" onClick={handleClick}>
            <figure className=" relative w-6 h-6 ">
                <Image src={'/icons/excel.svg'} alt={'Exportar a excel'} layout={'fill'} objectFit={'contain'} objectPosition={'center'}/>
            </figure>
        </button>
    )
}
