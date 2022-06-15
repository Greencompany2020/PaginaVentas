import Navbar from '../Navbar'

const BaseLayout = ({ children }) => {
  return (
   <div className='layout-base'>
    <section className='layout-base-navbar'>
      <Navbar/>
    </section>
    <section className='layout-base-main'>
      {children}
    </section>
   </div>
  )
}

export const getBaseLayout = page => (
  <BaseLayout>
    {page}
  </BaseLayout>
)

export default BaseLayout
