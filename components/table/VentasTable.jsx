// componentes externos
// componentes propios
// funciones y hooks
// recurso (img, js, css)

const VentasTable = ({ children, className}) => {
  return (
    <table className={`w-full ${className}`}>
      {children}
    </table>
  )
}

export default VentasTable
