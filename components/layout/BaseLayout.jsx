import Navbar from '../Navbar'

const BaseLayout = ({ children }) => {
  return (
   <div className='layout-base'>
    <section className='layout-base-navbar'>
      <Navbar/>
    </section>
    <main className='layout-base-main'>
      {children}
    </main>
   </div>
  )
}

export const getBaseLayout = page => (
  <BaseLayout>
    {page}
  </BaseLayout>
)

export default BaseLayout
