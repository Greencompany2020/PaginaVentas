// Componentes externos
// Componentes propios
import Navbar from '../Navbar';
import SideMenu from '../SideMenu';
// Funciones y hooks
// Recursos (img, js, css)

const VentasLayout = ({ children }) => {

  return (
    <>
      <Navbar />
      <div className='flex flex-col relative'>
        <SideMenu />
        <section className='flex flex-1 flex-col items-center overflow-hidden'>
          {children}
        </section>
      </div>
    </>
  )
}

export const getVentasLayout = page => (
  <VentasLayout>
    {page}
  </VentasLayout>
)

export default VentasLayout
