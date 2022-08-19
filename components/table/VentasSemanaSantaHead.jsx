const VentasSemanaSantaHead = ({ year1, year2 }) => {
  return (
    <thead className="text-white text-center text-xs table-head table-head-rl table-head-rr">
      <tr>
        <th className="border border-white">Dia</th>
        <th className="border border-white">{`Venta ${year1}`}</th>
        <th className="border border-white">{`Venta ${year2}`}</th>
        <th className="border border-white">%</th>
      </tr>
    </thead>
  );
};

export default VentasSemanaSantaHead;
