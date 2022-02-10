const PresupuestoFechaFooter = ({ compromiso,operaciones,promedio,bamarillo,brojo }) => {
  return (
    <tfoot className="bg-black text-white text-center font-bold">
      <tr>
        <td className="border border-white">Total</td>
        <td className="border border-white">{compromiso}</td>
        <td className="border border-white">{operaciones}</td>
        <td className="border border-white">{promedio}</td>
        <td className="border border-white">{bamarillo}</td>
        <td className="border border-white">{brojo}</td>
      </tr>
    </tfoot>
  );
};

export default PresupuestoFechaFooter;
