// Componentes externos
// Componentes propios
import Navbar from '@components/Navbar'
import SideMenu from '@components/SideMenu'
// Funciones y hooks
// Recursos (img, js, css)

const VentasLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className='flex relative min-h-screen'>
        <SideMenu />
        <section className='flex flex-1 flex-col items-center overflow-hidden'>
          {children}
        </section>
      </div>
    </>
  )
}

export const getLayout = page => (
  <VentasLayout>
    {page}
  </VentasLayout>
)

export default VentasLayout
