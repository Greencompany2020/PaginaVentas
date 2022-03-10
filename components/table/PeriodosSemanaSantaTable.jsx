import {  VentasTable } from ".";

const PeriodosSemanaSantaTable = ({ dates }) => {
  return (
    <>
      <VentasTable className="my-7 ">
      <thead className="bg-black text-white text-center">
        <tr>
          <th className="border border-white">Año</th>
          <th className="border border-white">Carnaval</th>
          <th className="border border-white">Inicio</th>
          <th className="border border-white">Fin</th>
        </tr>
      </thead>
      <tbody className="bg-white text-center">
        {
          dates?.map(fecha => (
            <tr key={fecha.agno} className={fecha.agno === new Date().getFullYear() ? "font-bold" : ""}>
              <td>{fecha.agno}</td>
              <td>{fecha.carnaval}</td>
              <td>{fecha.fechaInicio}</td>
              <td>{fecha.fechaFin}</td>
            </tr>
          ))
        }
      </tbody>
      </VentasTable>
    </>
  );
};

export default PeriodosSemanaSantaTable;
