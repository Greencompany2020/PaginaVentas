import Navbar from '../Navbar'

const BaseLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export const getBaseLayout = page => (
  <BaseLayout>
    {page}
  </BaseLayout>
)

export default BaseLayout
