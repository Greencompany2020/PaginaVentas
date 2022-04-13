const PresupuestoBasesTableHead = ({ year1, year2,tienda }) => {
  return (
    tienda= '',
    <thead className="bg-black text-white text-center">
      <tr>
        <th className="border border-white">{tienda}</th>
        <th colSpan={2} className="border border-white">Enero</th>
        <th colSpan={2} className="border border-white">Febrero</th>
        <th colSpan={2} className="border border-white">Marzo</th>
        <th colSpan={2} className="border border-white">Abril</th>
        <th colSpan={2} className="border border-white">Mayo</th>
        <th colSpan={2} className="border border-white">Junio</th>
        <th colSpan={2} className="border border-white">Julio</th>
        <th colSpan={2} className="border border-white">Agosto</th>
        <th colSpan={2} className="border border-white">Septiembre</th>
        <th colSpan={2} className="border border-white">Octubre</th>
        <th colSpan={2} className="border border-white">Noviembre</th>
        <th colSpan={2} className="border border-white">Diciembre</th>
      </tr>
    </thead>

  );
};

export default PresupuestoBasesTableHead;
