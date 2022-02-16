import Link from 'next/link'

const DashboardButtonContainer = ({ children, link }) => {
  return (
    <div className='bg-gray-200 w-56 h-52 rounded-2xl p-7 hover:scale-110 transition ease-in-out duration-200'>
      <Link href={link}>
        <a>{children}</a>
      </Link>
    </div>
  )
}

export default DashboardButtonContainer
