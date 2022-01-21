import Link from 'next/link'

const MinutasButton = ({ children, onClick }) => {
  return (
    <button className="bg-sky-500 w-40 rounded-lg h-10 flex justify-center items-center ml-2 mt-1 hover:bg-sky-400 transition-all ease-in-out duration-200"
      onClick={onClick}>
      {children}
    </button>
  )
}

export default MinutasButton
