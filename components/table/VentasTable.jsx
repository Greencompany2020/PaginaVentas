// componentes externos
// componentes propios
// funciones y hooks
// recurso (img, js, css)

const VentasTable = ({ children, className }) => {
  return (
    <table
      className={` w-[calc(100%_+_800px)] md:w-full  h-full  ${className}`}
    >
      {children}
    </table>
  );
};

export default VentasTable;
