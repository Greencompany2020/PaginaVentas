const PresupuestoFechasTableHead = () => {
  return (
    <thead className="text-white">
      <tr>
        <th className="border border-white bg-black-shape rounded-tl-md">Fecha</th>
        <th className="border border-white bg-black-shape">Compromiso</th>
        <th className="border border-white bg-black-shape">Operaciones</th>
        <th className="border border-white bg-black-shape">Promedio</th>
        <th className="border border-white bg-black-shape">B-Amarillo</th>
        <th className="border border-white bg-black-shape rounded-tr-md">C-Rojo</th>
      </tr>
    </thead>
  );
};

export default PresupuestoFechasTableHead;
